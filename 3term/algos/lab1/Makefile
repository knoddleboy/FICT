CFLAGS = -g -Wall
CC = gcc

all: genfile kwaymerge

genfile: genfile.c util.h errors.h
	$(CC) $(CFLAGS) $(LDFLAGS) -o genfile genfile.c

kwaymerge: kwaymerge.c util.h errors.h
	$(CC) $(CFLAGS) $(LDFLAGS) -o kwaymerge kwaymerge.c -lm

1GiB: genfile
	./genfile -s 1G -o 1GiB.dat

clean:
	rm -f *.o kwaymerge genfile *.bin *.txt
