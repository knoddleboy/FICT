#pragma once

#include <string>
#include <vector>

using std::string;
using std::vector;

template <typename stream_T>
stream_T touch_file(const char *);

void fill_original_file(std::ofstream &);
void copy_original_file_data(std::ifstream, std::ofstream &);
void display_files(std::ifstream, std::ifstream);