#include <iostream>
#include <string>
#include <cstdlib>
#include "./kwaymerge.h"

// Comparison function for the merge sort
bool numAsc(const uint64_t &a, const uint64_t &b) { return a < b; }

int main(int argc, char *argv[])
{
	if (argc != 3)
	{
		cout << "Wrong number of arguments.\n\tUsage: "
			 << argv[0] << " <in_file> <buffer_size> <?out_file> <?temps_path>"
			 << endl;
		exit(1);
	}

	string in_file = argv[1];
	uint64_t buffer_size = strtol(argv[2], nullptr, 10);
	string out_file = (argc == 4) ? argv[3] : stl_basename(argv[1]) + ".sorted";
	string temps_path = (argc == 5) ? argv[4] : "./temp";

	KwayMergeSort<uint64_t> *sorter = new KwayMergeSort<uint64_t>(in_file, out_file, buffer_size, numAsc, temps_path);

	// Perform sorting
	sorter->Sort();
	return 0;
}