#include <arpa/inet.h>
#include <err.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
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
#define BACKLOG 3 // Maximum pending connections

static void handle_client(int sockfd, const char *directory) {
        char filename[BUFFER_SIZE], buffer[BUFFER_SIZE];
        ssize_t rdsz, wrsz, total_sent = 0;
        int status, fd;
        struct stat st;
        uint32_t response[3];

        // Read file name from client
        if ((rdsz = read(sockfd, filename, sizeof(filename) - 1)) <= 0) {
                warn("Failed to read file name");
                close(sockfd);
                return;
        }
        filename[rdsz] = '\0';

        char filepath[BUFFER_SIZE * 2];
        snprintf(filepath, sizeof(filepath), "%s/%s", directory, filename);

        fd = open(filepath, O_RDONLY);
        if (fd < 0) {
                response[0] = htonl(STATUS_FILE_NOT_FOUND);
                response[1] = htonl(errno);
                if (write(sockfd, response, sizeof(response)) < 0)
                        warn("write()");
                warnx("File not found: %s", filepath);
                close(sockfd);
                return;
        }

        if (fstat(fd, &st) < 0) {
                warn("fstat() failed");
                close(fd);
                close(sockfd);
                return;
        }

        uint64_t file_size = (uint64_t)st.st_size;

        // Send file size to client
        status = STATUS_FILE_SIZE;
        response[0] = htonl(status);
        response[1] = htonl((uint32_t)(file_size & UINT32_MAX));
        response[2] = htonl((uint32_t)(file_size >> 32));
        if (write(sockfd, response, sizeof(response)) < 0) {
                warn("Failed to send file size");
                close(fd);
                close(sockfd);
                return;
        }

        // Read client's response
        if (read(sockfd, response, sizeof(response)) <= 0) {
                warn("Failed to read client response");
                close(fd);
                close(sockfd);
                return;
        }

        status = ntohl(response[0]);
        switch (status) {
        case STATUS_REFUSE_FILE:
                warnx("Client refused to accept file");
                close(fd);
                close(sockfd);
                return;
        case STATUS_READY_TO_ACCEPT:
                break;
        default:
                warnx("Unknown client response: %d", status);
                close(fd);
                close(sockfd);
                return;
        }

        // Send file in chunks
        printf("Will send %" PRId64 " bytes\n", file_size);
        while ((rdsz = read(fd, buffer, CHUNK_SIZE)) > 0) {
                printf("... sending %zd bytes\n", rdsz);
                if ((wrsz = write(sockfd, buffer, rdsz)) < 0) {
                        warn("Failed to send file data");
                        break;
                }
                total_sent += wrsz;
        }

        if (rdsz < 0)
                warn("Failed to read file data");
        else
                printf("File '%s' sent successfully, total %zd bytes\n", filename, total_sent);

        close(fd);
        close(sockfd);
}

int main(int argc, char *argv[]) {
        if (argc != 4) {
                errx(EXIT_FAILURE, "Usage: %s <server_address> <server_port> <directory>", argv[0]);
        }

        const char *server_address = argv[1];
        int server_port = strtol(argv[2], NULL, 10);
        const char *directory = argv[3];

        int sockfd, clientfd;
        struct sockaddr_in server_addr = {0}, client_addr;
        socklen_t client_len = sizeof(client_addr);

        sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (sockfd < 0)
                err(EXIT_FAILURE, "socket()");

        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(server_port);
        if (inet_pton(AF_INET, server_address, &server_addr.sin_addr) <= 0)
                err(EXIT_FAILURE, "inet_pton()");

        if (bind(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
                err(EXIT_FAILURE, "bind()");

        if (listen(sockfd, BACKLOG) < 0)
                err(EXIT_FAILURE, "listen()");

        print_sock_addr("Server listening on", sockfd);

        while (1) {
                clientfd = accept(sockfd, (struct sockaddr *)&client_addr, &client_len);
                if (clientfd < 0) {
                        warn("accept()");
                        continue;
                }
                print_peer_addr("Client connected", clientfd);
                handle_client(clientfd, directory);
        }

        close(sockfd);
        return EXIT_SUCCESS;
}
