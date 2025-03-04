#include <arpa/inet.h>
#include <err.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>

#include "print_addr.h"

void print_sockaddr(const char *msg, const struct sockaddr *sa, socklen_t len) {
        int error;
        char host_str[INET6_ADDRSTRLEN];
        char port_str[sizeof("12345")];

        error = getnameinfo(sa, len, host_str, sizeof(host_str), port_str, sizeof(port_str),
                            NI_NUMERICHOST | NI_NUMERICSERV);
        if (error != 0) {
                if (error == EAI_SYSTEM)
                        err(EXIT_FAILURE, "getnameinfo(): system error");
                errx(EXIT_FAILURE, "getnameinfo(): %s", gai_strerror(error));
        }
        printf("%s %s:%s\n", msg, host_str, port_str);
}

void print_sock_addr(const char *msg, int fd) {
        struct sockaddr_storage ss;
        socklen_t len = sizeof(ss);
        if (getsockname(fd, (struct sockaddr *)&ss, &len) < 0)
                err(EXIT_FAILURE, "getsockname()");
        print_sockaddr(msg, (struct sockaddr *)&ss, len);
}

void print_peer_addr(const char *msg, int fd) {
        struct sockaddr_storage ss;
        socklen_t len = sizeof(ss);
        if (getpeername(fd, (struct sockaddr *)&ss, &len) < 0)
                err(EXIT_FAILURE, "getpeername()");
        print_sockaddr(msg, (struct sockaddr *)&ss, len);
}
