#pragma once

#include <fstream>

std::fstream create_file(const char *);
void fill_original_file(std::fstream &);
void copy_original_file_data(std::fstream &, std::fstream &);
void display_files(std::fstream &, std::fstream &);