#ifndef _ERRORS_H_
#define _ERRORS_H_

#include <stdio.h>

#define E_NO_SIZE 1
#define E_INV_SIZE 2
#define E_INV_SZ_SUFFIX 3
#define E_NAN_SIZE 4
#define E_NO_OUTPUT_FILE 5
#define E_NO_INPUT_FILE 6
#define E_OPEN_OUTFILE 7
#define E_OPEN_INFILE 8
#define E_INFILE_EQ_OUTFILE 9
#define E_INV_KWAYS 10
#define E_NO_KWAYS 11
#define E_CREATE_TEMPFILE 12

static char *errors[] = {
	"dummystr",
	"Size not set.",
	"Invalid size.",
	"Invalid suffix: Use K-Kilobytes, M-Megabytes or G-Gigabytes.",
	"Size must be a number.",
	"Output file not set.",
	"Source file not set.",
	"Error opening output file.",
	"Error opening input file.",
	"Input and output files can't be the same.",
	"Invalid K",
	"K not set.",
	"Error creating temporary file."};

static void pr_error(short __err) { printf("%s\n", errors[__err]); }
static char *get_error(short __err) { return errors[__err]; }

#endif
