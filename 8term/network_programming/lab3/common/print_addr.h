#include <netinet/in.h>

void print_sockaddr(const char *msg, const struct sockaddr *sa, socklen_t len);
void print_sock_addr(const char *msg, int fd);
void print_peer_addr(const char *msg, int fd);
