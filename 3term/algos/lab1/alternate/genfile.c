#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <string.h>
#include <stdint.h>

#include "errors.h"
#include "util.h"

#define print_error_and_usage(error) \
	do                               \
	{                                \
		pr_error(error);             \
		print_usage(argv);           \
	} while (0);

void print_usage(char *argv[])
{
	printf("Usage:\n    ");
	printf("%s -s <bin_file_size>K|M|G -o <bin_file>\n", argv[0]);
}

int main(int argc, char *argv[])
{
	extern char *optarg;
	char outfile_path[PATH_SIZE] = {0};
	long size = 0;
	unsigned long registers;
	int option;
	uint32_t randnum;
	time_t t;

	while ((option = getopt(argc, argv, "o:s:")) != -1)
	{
		switch (option)
		{
		case 'o':
			strcpy(outfile_path, optarg);
			break;
		case 's':
			size = parse_size(optarg);
			break;
		}
	}

	if (!outfile_path[0])
	{
		print_error_and_usage(E_NO_OUTPUT_FILE);
		return -E_NO_OUTPUT_FILE;
	}

	if (size == 0)
	{
		print_error_and_usage(E_NO_SIZE);
		return -E_NO_SIZE;
	}

	if (size < 0)
	{
		print_error_and_usage(-size);
		return size;
	}

	FILE *outfile = fopen(outfile_path, "wb");
	if (!outfile)
	{
		perror(get_error(E_OPEN_OUTFILE));
		return -E_OPEN_OUTFILE;
	}

	registers = size / sizeof(uint32_t);
	srandom((unsigned)time(&t));

	while (registers--)
	{
		randnum = random();
		fwrite(&randnum, sizeof(uint32_t), 1, outfile);
	}

	fclose(outfile);

	return 0;
}
