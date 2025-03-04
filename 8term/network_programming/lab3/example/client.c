#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <netdb.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/socket.h>
#include <sys/stat.h>
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

static void sigpipe_ignore(void) {
        struct sigaction sigact;

        sigact.sa_handler = SIG_IGN;
        sigact.sa_flags = 0;
        if (sigaction(SIGPIPE, &sigact, NULL) < 0)
                exit_err("sigaction()");
}

int writen(int fd, const void *buf, size_t n) {
        size_t total;
        ssize_t wrsz;

        total = 0;
        do {
                wrsz = write(fd, (char *)buf + total, n - total);
                if (wrsz < 0) {
                        warn_err("writen(): write()");
                        return -1;
                }
                if (wrsz == 0 && n != 0) {
                        warn_errx("writen(): write() wrote zero bytes");
                        errno = 0;
                        return -1;
                }
                total += (size_t)wrsz;
        } while (total != n);
        return 0;
}

#define BUFSZ 10

static void request_server(int sockfd) {
        const char *pathname = "/tmp/file.txt";
        struct stat statbuf;
        size_t sz;
        ssize_t rdsz;
        uint64_t file_sz, total;
        uint32_t buf32[2];
        int filefd;
        char buf[BUFSZ];

        filefd = open(pathname, O_RDONLY);
        if (filefd < 0)
                exit_err("request_server(): open() for %s", pathname);
        if (fstat(filefd, &statbuf) < 0)
                exit_err("request_server(): fstat()");

        if ((uintmax_t)statbuf.st_size > UINT64_MAX)
                exit_errx("too many bytes to be sent");
        file_sz = (uint64_t)statbuf.st_size;
        buf32[0] = htonl((uint32_t)(file_sz & UINT32_MAX));
        buf32[1] = htonl((uint32_t)(file_sz >> 32));
        if (writen(sockfd, buf32, sizeof(buf32)) < 0)
                exit_errx("request_server(): writen() failed");
        printf("Will send %jd bytes\n", (intmax_t)statbuf.st_size);

        total = 0;
        for (;;) {
                sz = file_sz - total > sizeof(buf) ? sizeof(buf) : (size_t)(file_sz - total);
                rdsz = read(filefd, buf, sz);
                if (rdsz < 0)
                        exit_err("request_server(): read()");
                if (rdsz == 0)
                        exit_errx("request_server(): not enough data in file");
                printf("... sending %zd bytes\n", rdsz);
                if (writen(sockfd, buf, (size_t)rdsz) < 0)
                        exit_errx("request_server(): writen() failed");
                total += (size_t)rdsz;
                if (total == file_sz)
                        break;
        }
        printf("File content have been successfully sent\n");

        if (close(filefd) < 0)
                exit_err("close()");
}

int main(void) {
        struct sockaddr_in sin4 = {};
        in_addr_t srv_addr = INADDR_LOOPBACK;
        in_port_t srv_port = 1234;
        int connfd;

        sigpipe_ignore();

        connfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (connfd < 0)
                exit_err("socket()");

        sin4.sin_family = AF_INET;
        sin4.sin_addr.s_addr = htonl(srv_addr);
        sin4.sin_port = htons(srv_port);
        if (connect(connfd, (struct sockaddr *)&sin4, sizeof(sin4)) < 0)
                exit_err("connect()");
        print_sock_addr("Src address", connfd);
        print_peer_addr("Dst address", connfd);

        request_server(connfd);

        if (close(connfd) < 0)
                exit_err("close()");
}
