#include <arpa/inet.h>
#include <ctype.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <netdb.h>
#include <netinet/in.h>
#include <poll.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>

#ifndef INADDR_LOOPBACK
#define INADDR_LOOPBACK ((in_addr_t)0x7f000001)
#endif

enum client_state {
        CLIENT_COMMAND,
        CLIENT_TRANSFER,
        CLIENT_SHUTDOWN,
};

struct client {
        const struct pollfd *pollfd;
        enum client_state state;
};

static void print_sockaddr(const char *msg, const struct sockaddr *sa) {
        int error;
        socklen_t len;
        char host_str[INET6_ADDRSTRLEN];
        char port_str[sizeof("12345")];

        switch (sa->sa_family) {
        case AF_INET:
                len = sizeof(struct sockaddr_in);
                break;
        case AF_INET6:
                len = sizeof(struct sockaddr_in6);
                break;
        default:
                exit_errx("print_sockaddr(): sa_family == %u", (unsigned int)sa->sa_family);
        }
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
        print_sockaddr(msg, (struct sockaddr *)&ss);
}

bool program_error(void) {
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

static void set_reuseaddr(int sockfd) {
        int opt;

        opt = 1;
        if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0)
                exit_err("set_reuseaddr(): setsockopt()");
}

static void set_nonblock(int fd) {
        int flags;

        flags = fcntl(fd, F_GETFL);
        if (flags < 0)
                exit_err("set_nonblock(): fcntl()");
        if (fcntl(fd, F_SETFL, flags | O_NONBLOCK) < 0)
                exit_err("set_nonblock(): fcntl()");
}

static void handle_client(struct client *client) {
        ssize_t rdsz;
        char buf[1];

        for (;;) {
                rdsz = read(client->pollfd->fd, buf, 1);
                if (rdsz < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK)
                                break;
                        if (program_error())
                                exit_err("handle_client(): read()");
                        warn_err("handle_client(): read()");
                        client->state = CLIENT_SHUTDOWN;
                        break;
                }
                if (rdsz == 0) {
                        printf("read() returned zero\n");
                        client->state = CLIENT_SHUTDOWN;
                        break;
                }
                if (isprint(buf[0]))
                        printf("<%c>", buf[0]);
                else
                        printf("<%02x>", buf[0]);
                fflush(stdout);
        }
        if (client->state != CLIENT_SHUTDOWN)
                printf("\n");
}

int main(void) {
        const unsigned int cln_num_max = 3;
        struct sockaddr_in srv_sin4 = {};
        struct sockaddr_in cln_sin4;
        in_addr_t srv_addr = INADDR_LOOPBACK;
        in_port_t srv_port = 1234;
        struct pollfd pollfd[cln_num_max + 1];
        struct client client[cln_num_max + 1];
        socklen_t addrlen;
        unsigned int i, cln_num;
        int listenfd, connfd, nready;

        listenfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (listenfd < 0)
                exit_err("socket()");

        set_reuseaddr(listenfd);
        set_nonblock(listenfd);

        srv_sin4.sin_family = AF_INET;
        srv_sin4.sin_addr.s_addr = htonl(srv_addr);
        srv_sin4.sin_port = htons(srv_port);
        if (bind(listenfd, (struct sockaddr *)&srv_sin4, sizeof(srv_sin4)) < 0)
                exit_err("bind()");

        if (listen(listenfd, 3) < 0)
                exit_err("listen()");

        pollfd[0].fd = listenfd;
        pollfd[0].events = POLLIN;
        for (i = 1; i <= cln_num_max; ++i)
                pollfd[i].fd = -1;

        cln_num = 0;
        print_sock_addr("Accepting at", listenfd);
        for (;;) {
                printf("Polling (clients number %u)...\n", cln_num);
                nready = poll(pollfd, cln_num_max + 1, -1);
                if (nready < 0)
                        exit_err("poll()");
                if (nready == 0) {
                        warn_errx("poll() returned zero");
                        continue;
                }
                if (pollfd[0].revents & (POLLERR | POLLHUP | POLLNVAL)) {
                        warn_errx("poll() returned error for listenfd");
                        --nready;
                } else if (pollfd[0].revents & POLLIN) {
                        addrlen = sizeof(cln_sin4);
                        connfd = accept(listenfd, (struct sockaddr *)&cln_sin4, &addrlen);
                        if (connfd < 0) {
                                if (errno != EAGAIN && errno != EWOULDBLOCK)
                                        exit_err("accept()");
                                warn_err("accept()");
                        } else {
                                print_sockaddr("  New client", (struct sockaddr *)&cln_sin4);
                                set_nonblock(connfd);
                                for (i = 1; i <= cln_num_max; ++i)
                                        if (pollfd[i].fd == -1) {
                                                printf("    -> client %u\n", i);
                                                pollfd[i].fd = connfd;
                                                pollfd[i].events = POLLIN;
                                                pollfd[i].revents = 0;
                                                client[i].pollfd = &pollfd[i];
                                                client[i].state = CLIENT_COMMAND;
                                                break;
                                        }
                                if (++cln_num == cln_num_max) {
                                        printf("  Not accepting new connections\n");
                                        pollfd[0].fd = -1;
                                }
                        }
                        --nready;
                }
                for (i = 1; i <= cln_num_max && nready > 0; ++i) {
                        if (pollfd[i].revents == 0)
                                continue;
                        if (pollfd[i].revents & (POLLERR | POLLHUP | POLLNVAL)) {
                                warn_errx("poll() returned error for client %u", i);
                                client[i].state = CLIENT_SHUTDOWN;
                        } else if (pollfd[i].revents & (POLLIN | POLLOUT)) {
                                printf("  POLLIN|POLLOUT set for client %u\n", i);
                                handle_client(&client[i]);
                        }
                        if (client[i].state == CLIENT_SHUTDOWN) {
                                printf("  Client %u exited\n", i);
                                if (close(pollfd[i].fd) < 0)
                                        exit_err("close()");
                                pollfd[i].fd = -1;
                                if (cln_num-- == cln_num_max) {
                                        printf("  Can accept new connection again\n");
                                        pollfd[0].fd = listenfd;
                                }
                        }
                        --nready;
                }
        }

        if (close(listenfd) < 0)
                exit_err("close()");
}
