#ifndef _UTIL_H_
#define _UTIL_H_

#include <ctype.h>
#include <stdbool.h>
#include <string.h>
#include <stdlib.h>
#include <stdint.h>

#include "errors.h"

#define PATH_SIZE 512

bool is_number(char *__str)
{
	if (!__str[0])
		return false;

	while (*__str)
	{
		if (!isdigit(*__str))
			return false;
		++__str;
	}

	return true;
}

long parse_size(char *__size_str)
{
	int suffix_idx;
	char suffix;
	long size;

	suffix_idx = strlen(__size_str) - 1;
	suffix = toupper(__size_str[suffix_idx]);
	__size_str[suffix_idx] = 0;

	if (!is_number(__size_str))
		return -E_NAN_SIZE;

	size = strtoul(__size_str, NULL, 0) * 1024;

	if (size <= 0)
		return -E_INV_SIZE;

	if (suffix == 'M')
		size *= 1024;
	else if (suffix == 'G')
		size *= 1024 * 1024;
	else if (suffix != 'K')
		return -E_INV_SZ_SUFFIX;

	return size;
}

int parse_nways(char *__ways_str)
{
	if (!__ways_str)
		return -E_NO_KWAYS;

	int k = atoi(__ways_str);
	if (k <= 0)
		return -E_INV_KWAYS;

	return k;
}

size_t get_file_size(FILE *file)
{
	size_t size;
	fseek(file, 0L, SEEK_END);
	size = ftell(file);
	fseek(file, 0L, SEEK_SET);
	return size;
}

int comparator(const void *p1, const void *p2) { return (*(int *)p1 - *(int *)p2); }

#define tmpfile_block_next(file)                            \
	{                                                       \
		if (file.current_block && file.current_block->next) \
		{                                                   \
			file.current_block->position = 0;               \
			file.current_block = file.current_block->next;  \
			file.current_block->position = 4;               \
		}                                                   \
	}

#define tmpfile_has_data(file) file.first_block &&file.first_block->size > 0

#define tmpfile_reset(file)                         \
	{                                               \
		if (file.first_block && file.current_block) \
		{                                           \
			file.current_block = file.first_block;  \
			file.current_block->position = 0;       \
		}                                           \
	}

#endif
