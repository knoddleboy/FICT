#pragma once

#include <fstream>
#include "./dependencies.h"

/**
 * @brief Copies all the data from the original file and line by line pastes into output file
 *
 * @param original_file stream of the original file
 * @param output_file stream of the output file
 */
void copy_original_file_data(std::ifstream original_file, std::ofstream &output_file)
{
    string line; // represents line in the original file

    /**
     * 1) Read every line in the file and get its first letter.
     * 2) Insert each line into output file, then captured first letter.
     */
    while (std::getline(original_file, line))
    {
        char first_letter_in_line = line[0];
        output_file << line << first_letter_in_line << std::endl;
    }
}