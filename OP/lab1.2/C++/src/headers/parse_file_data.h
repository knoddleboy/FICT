#pragma once

#include "struct.h"

#include <fstream>
#include <vector>

#include "touch_file.h"
#include "read_write_data.h"

using std::vector;

/**
 * @brief Parses the content of the data file into a vector of structs,
 * where each struct represents every single line's parts: name and two dates.
 *
 * @param input_file_path path to the file
 * @return vector of structs
 */
vector<FileData> parse_file_data(const char *input_file_path)
{
    // Open file stream
    std::ifstream input_file = touch_file<std::ifstream>(input_file_path);

    input_file.seekg(0, std::ios::beg);

    vector<FileData> file_content;
    FileData temp;

    while (read<std::ifstream>(input_file, temp.full_name, temp.age, temp.works))
        file_content.push_back(temp);

    input_file.clear();
    input_file.close();

    return file_content;
}