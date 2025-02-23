#include <arpa/inet.h>
#include <err.h>
#include <inttypes.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  int opt, error;

  const char *hostname = NULL;
  const char *servname = NULL;
  int ipversion = 0;
  int resolve_name = 0;    // resolve network name from address
  int resolve_service = 0; // resolve service name from port

  while ((opt = getopt(argc, argv, ":h:p:i:ns")) != -1) {
    switch (opt) {
    case 'h':
      hostname = optarg;
      break;
    case 'p':
      servname = optarg;
      break;
    case 'i':
      ipversion = strtoul(optarg, NULL, 0);
      break;
    case 'n':
      resolve_name = 1;
      break;
    case 's':
      resolve_service = 1;
      break;
    default:
      return EXIT_FAILURE;
    }
  }

  struct addrinfo ai_hints = {}, *ai_result;
  ai_hints.ai_family = (ipversion == 4)   ? AF_INET
                       : (ipversion == 6) ? AF_INET6
                                          : AF_UNSPEC;

  error = getaddrinfo(hostname, servname, &ai_hints, &ai_result);
  if (error != 0) {
    errx(1, "getaddrinfo: %s", gai_strerror(error));
  }

  const struct addrinfo *ai;
  char ipstr[INET6_ADDRSTRLEN];

  for (ai = ai_result; ai != NULL; ai = ai->ai_next) {
    void *sin, *addr;
    const char *ipver;

    if (ai->ai_family == AF_INET) {
      struct sockaddr_in *sin = (struct sockaddr_in *)ai->ai_addr;
      addr = &sin->sin_addr.s_addr;
      ipver = "IPv4";
    } else {
      struct sockaddr_in6 *sin = (struct sockaddr_in6 *)ai->ai_addr;
      addr = &sin->sin6_addr.s6_addr;
      ipver = "IPv6";
    }

    if (inet_ntop(ai->ai_family, addr, ipstr, sizeof(ipstr)) == NULL) {
      errx(1, "inet_ntop()");
    }

    printf("%s address %s, ", ipver, ipstr);
    printf("protocol %d (%s)\n", ai->ai_protocol,
           getprotobynumber(ai->ai_protocol)->p_name);

    if (resolve_name) {
      char hbuf[NI_MAXHOST];
      error = getnameinfo(ai->ai_addr, ai->ai_addrlen, hbuf, sizeof(hbuf), NULL,
                          0, NI_NAMEREQD);
      if (error != 0) {
        errx(1, "getnameinfo: %s", gai_strerror(error));
      }
      printf("  resolved hostname: %s\n", hbuf);
    }

    if (resolve_service) {
      char sbuf[NI_MAXSERV];
      error = getnameinfo(ai->ai_addr, ai->ai_addrlen, NULL, 0, sbuf,
                          sizeof(sbuf), 0);
      if (error != 0) {
        errx(1, "getnameinfo: %s", gai_strerror(error));
      }
      printf("  resolved service: %s\n", sbuf);
    }
  }

  return EXIT_SUCCESS;
}
