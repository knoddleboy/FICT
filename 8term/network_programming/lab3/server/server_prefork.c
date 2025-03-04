#include <arpa/inet.h>
#include <err.h>
#include <errno.h>
#include <fcntl.h>
#include <inttypes.h>
#include <netinet/in.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>

#include "print_addr.h"
#include "status.h"

#define BUFFER_SIZE 1024
#define CHUNK_SIZE 256
#define BACKLOG 3

static int num_children;
static pid_t *child_pids;

static void sigchld_handler(int signo) {
        (void)signo;
        while (waitpid(-1, NULL, WNOHANG) > 0)
                ;
}

static void setup_sigchld_handler(void) {
        struct sigaction sa = {0};
        sa.sa_handler = sigchld_handler;
        sigemptyset(&sa.sa_mask);
        sa.sa_flags = SA_RESTART | SA_NOCLDSTOP;
        if (sigaction(SIGCHLD, &sa, NULL) < 0)
                err(EXIT_FAILURE, "sigaction()");
}

static void handle_client(int sockfd, const char *directory) {
        char filename[BUFFER_SIZE], buffer[BUFFER_SIZE], client_info[INET_ADDRSTRLEN + 8];
        ssize_t rdsz, wrsz, total_sent = 0;
        int status, fd;
        struct stat st;
        uint32_t response[3];

        char client_addr_str[INET_ADDRSTRLEN];
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);

        getpeername(sockfd, (struct sockaddr *)&client_addr, &client_len);
        inet_ntop(AF_INET, &client_addr.sin_addr, client_info, sizeof(client_info));
        int client_port = ntohs(client_addr.sin_port);
        snprintf(client_info, sizeof(client_info), "%s:%d", client_info, client_port);

        // Read file name from client
        if ((rdsz = read(sockfd, filename, sizeof(filename) - 1)) <= 0) {
                warn("[%s] Failed to read file name", client_info);
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
                warnx("[%s] File not found: %s", client_info, filename);
                close(sockfd);
                return;
        }

        if (fstat(fd, &st) < 0) {
                warn("[%s] fstat() failed", client_info);
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
                warn("[%s] Failed to send file size", client_info);
                close(fd);
                close(sockfd);
                return;
        }

        // Read client's response
        if (read(sockfd, response, sizeof(response)) <= 0) {
                warn("[%s] Failed to read client response", client_info);
                close(fd);
                close(sockfd);
                return;
        }

        status = ntohl(response[0]);
        switch (status) {
        case STATUS_REFUSE_FILE:
                warnx("[%s] Client refused to accept file", client_info);
                close(fd);
                close(sockfd);
                return;
        case STATUS_READY_TO_ACCEPT:
                break;
        default:
                warnx("[%s] Unknown client response: %d", client_info, status);
                close(fd);
                close(sockfd);
                return;
        }

        // Send file in chunks
        printf("[%s] Will send %" PRId64 " bytes\n", client_info, file_size);
        while ((rdsz = read(fd, buffer, CHUNK_SIZE)) > 0) {
                printf("[%s] ... sending %zd bytes\n", client_info, rdsz);
                if ((wrsz = write(sockfd, buffer, rdsz)) < 0) {
                        warn("[%s] Failed to send file data", client_info);
                        break;
                }
                total_sent += wrsz;
                sleep(1);
        }

        if (rdsz < 0)
                warn("[%s] Failed to read file data", client_info);
        else
                printf("[%s] File '%s' sent successfully, total %zd bytes\n", client_info, filename,
                       total_sent);

        close(fd);
        close(sockfd);
}

static void child_process(int sockfd, const char *directory) {
        while (1) {
                int clientfd = accept(sockfd, NULL, NULL);
                if (clientfd < 0) {
                        warn("accept()");
                        continue;
                }
                print_peer_addr("Client connected", clientfd);
                handle_client(clientfd, directory);
        }
}

int main(int argc, char *argv[]) {
        if (argc != 5) {
                errx(EXIT_FAILURE,
                     "Usage: %s <server_address> <server_port> <directory> <num_children>",
                     argv[0]);
        }

        const char *server_address = argv[1];
        int server_port = strtol(argv[2], NULL, 10);
        const char *directory = argv[3];
        num_children = strtol(argv[4], NULL, 10);

        setup_sigchld_handler();

        int sockfd;
        struct sockaddr_in server_addr = {0};

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

        printf("Child processes: %d\n", num_children);

        child_pids = calloc(num_children, sizeof(pid_t));
        for (int i = 0; i < num_children; i++) {
                if ((child_pids[i] = fork()) == 0) {
                        child_process(sockfd, directory);
                        exit(EXIT_SUCCESS);
                }
        }

        while (1)
                pause();

        close(sockfd);
        return EXIT_SUCCESS;
}
