#include <arpa/inet.h>
#include <err.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include "print_addr.h"
#include "status.h"

#define BUFFER_SIZE 1024
#define MAX_FILENAME_LEN 256

static int connect_to_server(const char *server_address, int server_port) {
        int sockfd;
        struct sockaddr_in server_addr = {0};

        sockfd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        if (sockfd < 0)
                err(EXIT_FAILURE, "socket()");

        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(server_port);
        if (inet_pton(AF_INET, server_address, &server_addr.sin_addr) <= 0)
                err(EXIT_FAILURE, "inet_pton()");

        if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
                err(EXIT_FAILURE, "connect()");

        print_sock_addr("Src address", sockfd);
        print_peer_addr("Dst address", sockfd);

        return sockfd;
}

static uint64_t request_file(int sockfd, const char *filename, uint32_t max_size) {
        int status;
        uint32_t response[3];

        if (write(sockfd, filename, strlen(filename)) < 0)
                err(EXIT_FAILURE, "write()");

        if (read(sockfd, response, sizeof(response)) <= 0)
                err(EXIT_FAILURE, "read() server response");

        status = ntohl(response[0]);
        uint64_t file_size = ntohl(response[1]) + ((uint64_t)ntohl(response[2]) << 32);

        switch (status) {
        case STATUS_FILE_NOT_FOUND:
                warnx("Server: File not found (errno: %d)", (int)file_size);
                close(sockfd);
                exit(EXIT_FAILURE);
        case STATUS_FILE_SIZE:
                break;
        default:
                warnx("Server: Unknown response (%d)", status);
                close(sockfd);
                exit(EXIT_FAILURE);
        }

        if (file_size > max_size) {
                status = STATUS_REFUSE_FILE;
                response[0] = htonl(status);
                if (write(sockfd, response, sizeof(response)) < 0)
                        warn("write()");
                warnx("File too large (%" PRId64 " bytes), refusing", file_size);
                close(sockfd);
                exit(EXIT_FAILURE);
        }

        status = STATUS_READY_TO_ACCEPT;
        response[0] = htonl(status);
        if (write(sockfd, response, sizeof(response)) < 0)
                err(EXIT_FAILURE, "write()");

        return file_size;
}

static void receive_file(int sockfd, const char *filename, uint64_t file_size) {
        char buffer[BUFFER_SIZE];
        ssize_t rdsz, total_received;
        int fd;

        char output_filename[MAX_FILENAME_LEN + 32]; // extra space for uniqueness
        snprintf(output_filename, sizeof(output_filename), "%d_%s", getpid(), filename);

        fd = open(output_filename, O_WRONLY | O_CREAT | O_TRUNC, S_IRUSR | S_IWUSR);
        if (fd < 0)
                err(EXIT_FAILURE, "open()");

        printf("Will receive %" PRId64 " bytes\n", file_size);

        while ((rdsz = read(sockfd, buffer, BUFFER_SIZE)) > 0) {
                printf("... received %zd bytes\n", rdsz);
                if (write(fd, buffer, rdsz) != rdsz)
                        err(EXIT_FAILURE, "write()");
                total_received += rdsz;
        }

        if (rdsz < 0)
                err(EXIT_FAILURE, "read()");
        else
                printf("File '%s' received successfully, total %zd bytes\n", output_filename,
                       total_received);

        close(fd);
        close(sockfd);
}

int main(int argc, char *argv[]) {
        if (argc != 5) {
                errx(EXIT_FAILURE,
                     "Usage: %s <server_address> <server_port> <file_name> <max_size>", argv[0]);
        }

        const char *server_address = argv[1];
        int server_port = strtol(argv[2], NULL, 10);
        const char *file_name = argv[3];
        uint32_t max_size = strtoul(argv[4], NULL, 10);

        if (strlen(file_name) >= MAX_FILENAME_LEN)
                errx(EXIT_FAILURE, "File name is too long (max %d characters)",
                     MAX_FILENAME_LEN - 1);

        int sockfd = connect_to_server(server_address, server_port);
        uint64_t file_size = request_file(sockfd, file_name, max_size);
        receive_file(sockfd, file_name, file_size);

        return EXIT_SUCCESS;
}
