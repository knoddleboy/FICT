#pragma once

#include <fstream>
#include "./orig_file_data.h"

/**
 * @brief Fill the original file with data, provided by `orig_file_data.h`
 *
 * @param original_file path to the original file
 */
void fill_original_file(std::ofstream &original_file)
{
    original_file << original_file_data << std::endl;
}