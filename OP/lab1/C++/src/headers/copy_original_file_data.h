#pragma once

#include <fstream>
#include <string>

/**
 * @brief Copies all the data from the original file and line by line pastes into output file
 *
 * @param original_file path to the original file
 * @param output_file path to the output file
 */
void copy_original_file_data(std::fstream &original_file, std::fstream &output_file)
{
    std::string line; // represents line in the original file

    original_file.seekg(0, std::ios::beg); // Set position to the beginning

    /**
     * 1) Read every line in the file and get last letter of its first word.
     * 2) Insert each line into output file, then captured letter.
     */
    while (std::getline(original_file, line) && !original_file.eof())
    {
        char last_letter = line.substr(0, line.find(" ")).back();
        output_file << line << last_letter << std::endl;
    }

    original_file.clear();
    output_file.clear();
}