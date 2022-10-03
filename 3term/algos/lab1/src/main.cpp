#include <iostream>
#include <string>
#include <cstdlib>
#include "./kwaymerge.h"

// Comparison function for the merge sort
bool alphaAsc(const int &a, const int &b) { return a < b; }

int main(int argc, char *argv[])
{
	if (argc != 3)
	{
		cout << "Wrong number of arguments.\n\tUsage: " << argv[0] << " <in_file> <buffer_size>" << endl;
		exit(1);
	}

	string inFile = argv[1];
	int bufferSize = strtol(argv[2], nullptr, 10); // allow the sorter to use ? (base 10) of memory for sorting.
												   // once full, it will dump to a temp file and grab another chunk.
	bool compressOutput = false;				   // not yet supported
	string tempPath = "./temp";					   // allows you to write the intermediate files anywhere you want.

	ofstream *output_file = new ofstream("output.txt", ios::out);

	KwayMergeSort<int> *sorter = new KwayMergeSort<int>(inFile, output_file, alphaAsc, bufferSize, tempPath);

	// Perform sorting
	sorter->Sort();

	output_file->close();
	return 0;
}