#pragma once

#include <fstream>
#include <string>

/**
 * @brief Fill the original file with data, provided by `orig_file_data.h`
 *
 * @param original_file path to the original file
 */
void fill_original_file(std::fstream &original_file)
{
    string line; // represents line in the original file

    std::cout << "Enter text:" << std::endl;
    while (std::getline(std::cin, line))
    {
        original_file << line << std::endl;
    }

    original_file.clear();
}