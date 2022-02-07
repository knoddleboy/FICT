#pragma once

#include <iostream>

/**
 * @brief Opens file in mode, provided in template.
 *
 * @tparam stream_T filestream type. Can be one of the following: `fstream`, `ifstream`, `ofstream`
 * @param filepath path to the file to be touched
 * @return filestream object
 */
template <typename stream_T>
stream_T touch_file(const char *filepath)
{
    stream_T file(filepath);

    if (!file.is_open())
    {
        std::cerr << "Could not open/read file " << filepath << std::endl;
        exit(1);
    }

    return file;
}