#pragma once

#include <iostream>
#include <fstream>

/**
 * @brief Displays all the content of both files using stream buffer `rdbuf`
 *
 * @param original_file stream of the original file
 * @param output_file stream of the output file
 */
void display_files(std::ifstream original_file, std::ifstream output_file)
{
    std::cout << "\n[ Original file ]\n"
              << original_file.rdbuf() << std::endl;
    std::cout << "[ New (output) file ]\n"
              << output_file.rdbuf() << std::endl;
}