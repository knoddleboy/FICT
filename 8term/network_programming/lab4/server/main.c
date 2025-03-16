#include <arpa/inet.h>
#include <err.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <poll.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#include "print_addr.h"
#include "status.h"

#define BUFFER_SIZE 1024
#define CHUNK_SIZE 256
#define BACKLOG 3

enum client_state {
        CLIENT_WAIT_FILENAME,
        CLIENT_SEND_FILESIZE,
        CLIENT_WAIT_RESPONSE,
        CLIENT_TRANSFER,
        CLIENT_SHUTDOWN
};

struct client {
        struct pollfd *pollfd;
        enum client_state state;

        char filename[BUFFER_SIZE], buffer[CHUNK_SIZE];
        int file_fd;
        uint64_t file_size;
        uint64_t total_sent;

        char client_info[INET_ADDRSTRLEN + 8];
};

static void set_nonblock(int fd) {
        int flags = fcntl(fd, F_GETFL);
        if (flags < 0)
                err(EXIT_FAILURE, "set_nonblock(): fcntl()");

        if (fcntl(fd, F_SETFL, flags | O_NONBLOCK) < 0)
                err(EXIT_FAILURE, "set_nonblock(): fcntl()");
}

static void handle_client(struct client *client, const char *directory) {
        ssize_t rdsz, wrsz;
        uint32_t response[3];
        int client_fd = client->pollfd->fd;

        switch (client->state) {
        case CLIENT_WAIT_FILENAME:
                rdsz = read(client_fd, client->filename, sizeof(client->filename) - 1);
                if (rdsz <= 0) {
                        if (rdsz < 0 && (errno == EAGAIN || errno == EWOULDBLOCK))
                                return;
                        warn("[%s] Failed to read file name", client->client_info);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }
                client->filename[rdsz] = '\0';

                char filepath[BUFFER_SIZE * 2];
                snprintf(filepath, sizeof(filepath), "%s/%s", directory, client->filename);

                client->file_fd = open(filepath, O_RDONLY);
                if (client->file_fd < 0) {
                        response[0] = htonl(STATUS_FILE_NOT_FOUND);
                        response[1] = htonl(errno);
                        if (write(client_fd, response, sizeof(response)) < 0)
                                warn("write()");
                        warnx("[%s] File not found: %s", client->client_info, filepath);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                struct stat st;
                if (fstat(client->file_fd, &st) < 0) {
                        warn("[%s] fstat() failed", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                client->file_size = (uint64_t)st.st_size;
                client->total_sent = 0;
                client->state = CLIENT_SEND_FILESIZE;
                client->pollfd->events |= POLLOUT;
                return;

        case CLIENT_SEND_FILESIZE:
                response[0] = htonl(STATUS_FILE_SIZE);
                response[1] = htonl((uint32_t)(client->file_size & UINT32_MAX));
                response[2] = htonl((uint32_t)(client->file_size >> 32));
                if (write(client_fd, response, sizeof(response)) < 0) {
                        warn("[%s] Failed to send file size", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                client->state = CLIENT_WAIT_RESPONSE;
                return;

        case CLIENT_WAIT_RESPONSE:
                rdsz = read(client_fd, response, sizeof(response));
                if (rdsz <= 0) {
                        if (rdsz < 0 && (errno == EAGAIN || errno == EWOULDBLOCK))
                                return;
                        warn("[%s] Failed to read client response", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                int status = ntohl(response[0]);
                if (status == STATUS_REFUSE_FILE) {
                        warnx("[%s] Client refused the file", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }
                if (status != STATUS_READY_TO_ACCEPT) {
                        warnx("[%s] Unexpected response from client: %d", client->client_info, status);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                client->state = CLIENT_TRANSFER;
                return;

        case CLIENT_TRANSFER:
                if (client->total_sent <= 0)
                        printf("[%s] Will send %" PRId64 " bytes\n", client->client_info, client->file_size);

                rdsz = read(client->file_fd, client->buffer, CHUNK_SIZE);
                if (rdsz < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK)
                                return;
                        warn("[%s] Failed to read file data", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                } else if (rdsz == 0) {
                        printf("[%s] File '%s' sent successfully, total %lld bytes\n", client->client_info,
                               client->filename, client->total_sent);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }
                printf("[%s] ... sending %zd bytes\n", client->client_info, rdsz);

                wrsz = write(client_fd, client->buffer, rdsz);
                sleep(1); // simulate delay
                if (wrsz < 0) {
                        if (errno == EAGAIN || errno == EWOULDBLOCK)
                                return;
                        warn("[%s] Failed to send file data", client->client_info);
                        close(client->file_fd);
                        client->state = CLIENT_SHUTDOWN;
                        return;
                }

                client->total_sent += wrsz;
                return;

        case CLIENT_SHUTDOWN:
                return;
        }
}

int main(int argc, char *argv[]) {
        if (argc != 5) {
                errx(EXIT_FAILURE, "Usage: %s <server_address> <server_port> <directory> <max_clients>", argv[0]);
        }

        const char *server_address = argv[1];
        int server_port = strtol(argv[2], NULL, 10);
        const char *directory = argv[3];
        int max_clients = strtol(argv[4], NULL, 10);

        int sockfd, clientfd;
        struct sockaddr_in server_addr = {0}, client_addr;
        socklen_t client_len = sizeof(client_addr);
        struct pollfd pollfds[max_clients + 1];
        struct client clients[max_clients + 1];

        sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (sockfd < 0)
                err(EXIT_FAILURE, "socket()");

        set_nonblock(sockfd);

        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(server_port);
        if (inet_pton(AF_INET, server_address, &server_addr.sin_addr) <= 0)
                err(EXIT_FAILURE, "inet_pton()");

        if (bind(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
                err(EXIT_FAILURE, "bind()");

        if (listen(sockfd, BACKLOG) < 0)
                err(EXIT_FAILURE, "listen()");

        pollfds[0].fd = sockfd;
        pollfds[0].events = POLLIN;
        for (size_t i = 1; i <= max_clients; i++)
                pollfds[i].fd = -1;

        print_sock_addr("Server listening on", sockfd);

        int client_count = 0;
        while (1) {
                int nready = poll(pollfds, max_clients + 1, -1);
                if (nready < 0)
                        err(EXIT_FAILURE, "poll()");
                if (nready == 0) {
                        warn("poll() returned zero");
                        continue;
                }

                if (pollfds[0].revents & (POLLERR | POLLHUP | POLLNVAL)) {
                        warn("poll() error on listening socket");
                        --nready;
                } else if (pollfds[0].revents & POLLIN) {
                        clientfd = accept(sockfd, (struct sockaddr *)&client_addr, &client_len);
                        if (clientfd < 0) {
                                if (errno != EAGAIN && errno != EWOULDBLOCK)
                                        err(EXIT_FAILURE, "accept()");
                                warn("accept()");
                        } else {
                                print_peer_addr("New client connected", clientfd);
                                set_nonblock(clientfd);
                                for (size_t i = 1; i <= max_clients; i++)
                                        if (pollfds[i].fd == -1) {
                                                pollfds[i].fd = clientfd;
                                                pollfds[i].events = POLLIN;
                                                pollfds[i].revents = 0;
                                                clients[i].pollfd = &pollfds[i];
                                                clients[i].state = CLIENT_WAIT_FILENAME;

                                                // Save client info
                                                inet_ntop(AF_INET, &client_addr.sin_addr, clients[i].client_info,
                                                          sizeof(clients[i].client_info));
                                                int client_port = ntohs(client_addr.sin_port);
                                                snprintf(clients[i].client_info, sizeof(clients[i].client_info),
                                                         "%s:%d", clients[i].client_info, client_port);

                                                break;
                                        }

                                if (++client_count == max_clients) {
                                        warnx("Max clients reached. Rejecting connection");
                                        close(clientfd);
                                        --client_count;
                                }
                        }
                        --nready;
                }

                for (size_t i = 1; i < max_clients && nready > 0; i++) {
                        if (pollfds[i].revents == 0)
                                continue;

                        if (pollfds[i].revents & (POLLERR | POLLHUP | POLLNVAL)) {
                                warnx("poll() returned error for client %zu", i);
                                clients[i].state = CLIENT_SHUTDOWN;
                        } else if (pollfds[i].revents & (POLLIN | POLLOUT)) {
                                handle_client(&clients[i], directory);
                        }

                        if (clients[i].state == CLIENT_SHUTDOWN) {
                                printf("  Client %zu exited\n", i);
                                close(pollfds[i].fd);
                                pollfds[i].fd = -1;
                                if (client_count-- == max_clients) {
                                        printf("  Can accept new connection again\n");
                                        pollfds[0].fd = sockfd;
                                }
                        }
                        --nready;
                }
        }

        close(sockfd);
        return EXIT_SUCCESS;
}
