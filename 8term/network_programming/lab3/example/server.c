#include <arpa/inet.h>
#include <errno.h>
#include <inttypes.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>

// #include "utils.h"

#ifndef INADDR_LOOPBACK
#define INADDR_LOOPBACK ((in_addr_t)0x7f000001)
#endif

static void print_sockaddr(const char *msg, const struct sockaddr *sa, socklen_t len) {
        int error;
        char host_str[INET6_ADDRSTRLEN];
        char port_str[sizeof("12345")];

        error = getnameinfo(sa, len, host_str, sizeof(host_str), port_str, sizeof(port_str),
                            NI_NUMERICHOST | NI_NUMERICSERV);
        if (error != 0) {
                if (error == EAI_SYSTEM)
                        exit_err("getnameinfo(): system error");
                exit_errx("getnameinfo(): %s", gai_strerror(error));
        }
        printf("%s: %s:%s\n", msg, host_str, port_str);
}

static void print_sock_addr(const char *msg, int fd) {
        struct sockaddr_storage ss;
        socklen_t len;

        len = sizeof(ss);
        if (getsockname(fd, (struct sockaddr *)&ss, &len) < 0)
                exit_err("getsockname()");
        print_sockaddr(msg, (struct sockaddr *)&ss, len);
}

static void print_peer_addr(const char *msg, int fd) {
        struct sockaddr_storage ss;
        socklen_t len;

        len = sizeof(ss);
        if (getpeername(fd, (struct sockaddr *)&ss, &len) < 0)
                exit_err("getpeername()");
        print_sockaddr(msg, (struct sockaddr *)&ss, len);
}

static bool program_error(void) {
        switch (errno) {
        case EBADF:
        case ENOTSOCK:
        case EINVAL:
        case EFAULT:
                return true;
        default:
                return false;
        }
}

static int readn(int fd, void *buf, size_t n) {
        size_t total;
        ssize_t rdsz;

        total = 0;
        do {
                rdsz = read(fd, (char *)buf + total, n - total);
                if (rdsz < 0) {
                        warn_err("readn(): read()");
                        return -1;
                }
                if (rdsz == 0 && n != 0) {
                        warn_errx("readn(): read() read zero bytes");
                        errno = 0;
                        return -1;
                }
                total += (size_t)rdsz;
        } while (total != n);
        return 0;
}

#define BUFSZ 7

static void handle_client(int sockfd) {
        size_t sz;
        ssize_t rdsz;
        uint64_t file_sz, total;
        uint32_t buf32[2];
        char buf[BUFSZ];

        if (readn(sockfd, buf32, sizeof(buf32)) < 0) {
                if (program_error())
                        exit_errx("handle_client(): readn() failed");
                warn_errx("handle_client(): readn() failed");
                return;
        }
        file_sz = ntohl(buf32[0]) + ((uint64_t)ntohl(buf32[1]) << 32);
        printf("Will receive %" PRId64 " bytes\n", file_sz);

        total = 0;
        for (;;) {
                sz = file_sz - total > sizeof(buf) ? sizeof(buf) : (size_t)(file_sz - total);
                rdsz = read(sockfd, buf, sz);
                if (rdsz < 0) {
                        if (program_error())
                                exit_err("handle_client(): read()");
                        warn_err("handle_client(): read()");
                        return;
                }
                if (rdsz == 0) {
                        warn_errx("handle_client(): read() received zero bytes");
                        return;
                }
                printf("... received %zd bytes: ", rdsz);
                for (size_t i = 0; i < (size_t)rdsz; ++i)
                        printf("<%c>", buf[i]);
                printf("\n");
                total += (uint64_t)rdsz;
                if (total == file_sz)
                        break;
        }
        printf("File content have been successfully received\n");
}

int main(void) {
        struct sockaddr_in sin4 = {};
        in_addr_t srv_addr = INADDR_LOOPBACK;
        in_port_t srv_port = 1234;
        int listenfd, connfd, opt;

        listenfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (listenfd < 0)
                exit_err("socket()");

        opt = 1;
        if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0)
                exit_err("setsockopt()");

        sin4.sin_family = AF_INET;
        sin4.sin_addr.s_addr = htonl(srv_addr);
        sin4.sin_port = htons(srv_port);
        if (bind(listenfd, (struct sockaddr *)&sin4, sizeof(sin4)) < 0)
                exit_err("bind()");

        if (listen(listenfd, 3) < 0)
                exit_err("listen()");
        print_sock_addr("Listening address", listenfd);

        for (;;) {
                connfd = accept(listenfd, NULL, 0);
                if (connfd < 0)
                        exit_err("accept()");
                print_peer_addr("Dst address", connfd);

                handle_client(connfd);

                if (close(connfd) < 0)
                        exit_err("close()");
        }

        if (close(listenfd) < 0)
                exit_err("close()");
}
