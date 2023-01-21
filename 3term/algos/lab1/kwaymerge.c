#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdint.h>
#include <inttypes.h>
#include <string.h>
#include <math.h>
#include <time.h>

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
	printf("%s -i <in_file> -o <sorted_out_file> -m <memory_size>K|M|G -k <ways>\n", argv[0]);
}

typedef struct block_t
{
	size_t size;
	long position;
	struct block_t *next;
} block_t;

block_t *create_block()
{
	block_t *block = (block_t *)malloc(sizeof(block_t));

	block->next = NULL;
	block->position = 0;
	block->size = 0;

	return block;
}

typedef struct
{
	FILE *file;
	block_t *first_block;
	block_t *current_block;
} tmpfile_t;

void clear_blocks(tmpfile_t *__file)
{
	block_t *block = __file->first_block;
	while (block)
	{
		__file->first_block = __file->first_block->next;
		free(block);
		block = __file->first_block;
	}
	__file->first_block = NULL;
	__file->current_block = NULL;
}

tmpfile_t *open_tmpfiles(int __k)
{
	tmpfile_t *tmpfiles = (tmpfile_t *)malloc(__k * sizeof(tmpfile_t));

	for (size_t i = 0; i < __k; ++i)
	{
		tmpfiles[i].file = tmpfile();
		tmpfiles[i].first_block = NULL;
		tmpfiles[i].current_block = NULL;

		if (!tmpfiles[i].file)
		{
			perror(get_error(E_CREATE_TEMPFILE));
			printf("Closing temporary files...\n");

			for (__k = i - 1; i >= 0; --i)
				fclose(tmpfiles[i].file);

			return NULL;
		}
	}

	return tmpfiles;
}

void close_tmpfiles(int __k, tmpfile_t *__tfiles)
{
	while (__k--)
	{
		clear_blocks(&__tfiles[__k]);
		fclose(__tfiles[__k].file);
	}

	free(__tfiles);
}

void filequeue_next(uint32_t *__dest, tmpfile_t *__tmpfile)
{
	int nmemb_read;

	if (!__tmpfile->current_block ||
		__tmpfile->current_block->position == -1 ||
		__tmpfile->current_block->position > __tmpfile->current_block->size)
		return;

	nmemb_read = fread(__dest, sizeof(uint32_t), 1, __tmpfile->file);

	if (nmemb_read == 1)
		__tmpfile->current_block->position += sizeof(uint32_t);
	else
		__tmpfile->current_block->position = -1;
}

bool tmpfile_finished(tmpfile_t *__file)
{
	if (!__file->current_block)
		return true;

	return __file->current_block->size == 0 ||
		   __file->current_block->position == -1 ||
		   __file->current_block->position > __file->current_block->size;
}

void write_data(tmpfile_t *__tmpfile, uint32_t __data)
{
	fwrite(&__data, sizeof(uint32_t), 1, __tmpfile->file);
	__tmpfile->current_block->size += sizeof(uint32_t);
}

void dictribute_sort(int __k, size_t __buffer_size, uint32_t *__buffer, tmpfile_t *__tmpfiles, FILE *__infile)
{
	int nmemb_read, i = 0;
	size_t registers_per_read;

	registers_per_read = __buffer_size / sizeof(uint32_t);

	while ((nmemb_read = fread(__buffer, sizeof(uint32_t), registers_per_read, __infile)) > 0)
	{
		qsort(__buffer, nmemb_read, sizeof(uint32_t), comparator);

		fwrite(__buffer, sizeof(uint32_t), nmemb_read, __tmpfiles[i].file);

		if (__tmpfiles[i].first_block == NULL)
		{
			__tmpfiles[i].first_block = create_block();
			__tmpfiles[i].current_block = __tmpfiles[i].first_block;
		}
		else
		{
			__tmpfiles[i].current_block->next = create_block();
			__tmpfiles[i].current_block = __tmpfiles[i].current_block->next;
		}

		__tmpfiles[i].current_block->size = nmemb_read * sizeof(uint32_t);

		i = (i + 1) % __k;

		if (nmemb_read < registers_per_read)
			break;
	}

	while (__k--)
		__tmpfiles[__k].current_block = __tmpfiles[__k].first_block;
}

void merge(int __k, size_t __buffer_size, uint32_t *__buffer, tmpfile_t *__files, FILE *__outfile)
{
	bool block_finished;
	int min, outfile_idx, nmemb_read, registers_per_read;

	tmpfile_t *auxfiles = open_tmpfiles(__k);

	tmpfile_t *infiles = __files;
	tmpfile_t *outfiles = auxfiles;

	for (size_t i = 0; i < __k; ++i)
	{
		rewind(infiles[i].file);
		filequeue_next(&__buffer[i], &infiles[i]);
		outfiles[i].first_block = create_block();
		outfiles[i].current_block = outfiles[i].first_block;
	}

	outfile_idx = 0;

	block_finished = false;
	while (!block_finished)
	{
		block_finished = true;

		for (size_t i = 0; i < __k; ++i)
		{
			if (tmpfile_finished(&infiles[i]))
				continue;

			block_finished = false;
			min = i;

			for (size_t j = 0; j < __k; ++j)
			{
				if (i == j)
					continue;

				if (tmpfile_finished(&infiles[j]))
					continue;

				if (__buffer[j] < __buffer[min])
					min = j;
			}

			write_data(&outfiles[outfile_idx], __buffer[min]);
			filequeue_next(&__buffer[min], &infiles[min]);
		}

		int old_outfile_idx = outfile_idx;

		if (block_finished)
		{
			outfiles[outfile_idx].current_block->next = create_block();
			outfiles[outfile_idx].current_block = outfiles[outfile_idx].current_block->next;

			outfile_idx = (outfile_idx + 1) % __k;

			for (size_t i = 0; i < __k; ++i)
			{
				tmpfile_block_next(infiles[i]);

				if (!tmpfile_finished(&infiles[i]))
					block_finished = false;
			}
		}

		if (block_finished)
		{
			int outfile_count = 0;

			for (size_t i = 0; i < __k; ++i)
			{
				if (tmpfile_has_data(outfiles[i]))
					++outfile_count;
			}

			if (outfile_count > 1)
			{
				block_finished = false;
				infiles = infiles == __files ? auxfiles : __files;
				outfiles = outfiles == __files ? auxfiles : __files;

				for (size_t i = 0; i < __k; ++i)
				{
					rewind(infiles[i].file);
					tmpfile_reset(infiles[i]);
					filequeue_next(&__buffer[i], &infiles[i]);

					rewind(outfiles[i].file);
					ftruncate(fileno(outfiles[i].file), 0);
					clear_blocks(&outfiles[i]);
					outfiles[i].first_block = create_block();
					outfiles[i].current_block = outfiles[i].first_block;
				}
			}
		}

		if (block_finished)
		{
			fseek(outfiles[old_outfile_idx].file, 0L, SEEK_SET);
			registers_per_read = __buffer_size / sizeof(uint32_t);

			while (true)
			{
				nmemb_read = fread(__buffer, sizeof(uint32_t), registers_per_read, outfiles[old_outfile_idx].file);

				if (!nmemb_read)
					break;

				fwrite(__buffer, sizeof(uint32_t), nmemb_read, __outfile);
			}

			close_tmpfiles(__k, auxfiles);
		}
	}
}

int main(int argc, char *argv[])
{
	int option;
	extern char *optarg;

	char outfile_path[PATH_SIZE] = {0};
	char infile_path[PATH_SIZE] = {0};
	long size = 0;
	int k = 0;

	while ((option = getopt(argc, argv, "o:i:m:k:")) != -1)
	{
		switch (option)
		{
		case 'o':
			strcpy(outfile_path, optarg);
			break;
		case 'i':
			strcpy(infile_path, optarg);
			break;
		case 'm':
			size = parse_size(optarg);
			break;
		case 'k':
			k = parse_nways(optarg);
			break;
		}
	}

	if (!infile_path[0])
	{
		print_error_and_usage(E_NO_INPUT_FILE);
		return -E_NO_INPUT_FILE;
	}

	if (!outfile_path[0])
	{
		print_error_and_usage(E_NO_OUTPUT_FILE);
		return -E_NO_OUTPUT_FILE;
	}

	if (strcmp(infile_path, outfile_path) == 0)
	{
		print_error_and_usage(E_INFILE_EQ_OUTFILE);
		return -E_INFILE_EQ_OUTFILE;
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

	if (k == 0)
	{
		print_error_and_usage(E_NO_KWAYS);
		return -E_NO_KWAYS;
	}

	if (k < 0)
	{
		print_error_and_usage(-k);
		return k;
	}

	// Open temp files
	tmpfile_t *tmpfiles = open_tmpfiles(k);
	if (!tmpfiles)
	{
		pr_error(E_CREATE_TEMPFILE);
		fprintf(stderr, "Check the error messages. Aborting...\n");
		return -E_CREATE_TEMPFILE;
	}

	FILE *infile = fopen(infile_path, "rb");
	if (!infile)
	{
		perror(get_error(E_OPEN_INFILE));
		return -E_OPEN_INFILE;
	}

	FILE *outfile = fopen(outfile_path, "wb");
	if (!outfile)
	{
		perror(get_error(E_OPEN_OUTFILE));
		return -E_OPEN_OUTFILE;
	}

	size_t buffer_size = (size / sizeof(uint32_t)) * sizeof(uint32_t);
	uint32_t *buffer = (uint32_t *)malloc(buffer_size);

	// Distribute sorted chunks of input file data among temp files
	clock_t tstart = clock();
	dictribute_sort(k, buffer_size, buffer, tmpfiles, infile);
	clock_t tend = clock();
	double dtime_spent = (double)(tend - tstart) / CLOCKS_PER_SEC;
	printf("%-25s %.3lfs\n", "Distribution", dtime_spent);

	// Merge sorted temp files into one output file
	tstart = clock();
	merge(k, buffer_size, buffer, tmpfiles, outfile);
	tend = clock();
	double mtime_spent = (double)(tend - tstart) / CLOCKS_PER_SEC;
	printf("%-25s %.3lfs\n", "Merge", mtime_spent);

	printf("------\n%-25s %.3lfs\n", "Total", dtime_spent + mtime_spent);

	fclose(outfile);
	fclose(infile);

	free(buffer);

	close_tmpfiles(k, tmpfiles);

	return 0;
}
