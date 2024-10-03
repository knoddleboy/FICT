#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <string.h>
#include <stdint.h>

#include "errors.h"
#include "util.h"

#define print_error_and_usage(__err) \
	do                               \
	{                                \
		pr_error(__err);             \
		print_usage(argv);           \
	} while (0);

void print_usage(char *argv[])
{
	printf("Usage:\n    ");
	printf("%s -s <bin_file_size>K|M|G -o <bin_file>\n", argv[0]);
}

int main(int argc, char *argv[])
{
	int option;
	extern char *optarg;

	char outfile_path[PATH_SIZE] = {0};
	long size = 0;

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

	unsigned long registers = size / sizeof(uint32_t);
	srandom((unsigned)time(NULL));

	while (registers--)
	{
		uint32_t randnum = random();
		fwrite(&randnum, sizeof(uint32_t), 1, outfile);
	}

	fclose(outfile);

	return 0;
}
