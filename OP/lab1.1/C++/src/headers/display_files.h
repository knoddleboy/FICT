#pragma once

#include <iostream>
#include <fstream>

/**
 * @brief Displays all the content of both files using stream buffer `rdbuf`
 *
 * @param original_file stream of the original file
 * @param output_file stream of the output file
 */
void display_files(std::fstream &original_file, std::fstream &output_file)
{
    original_file.seekp(0, std::ios::beg); // Set position to the beginning
    output_file.seekp(0, std::ios::beg);

    std::cout << "\n[ Original file ]\n"
              << original_file.rdbuf() << std::endl;
    std::cout << "[ Output file ]\n"
              << output_file.rdbuf() << std::endl;
}