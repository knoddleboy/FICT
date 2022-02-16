#pragma once

#include <iostream>

/**
 * @brief Creates input/output filestream
 *
 * @tparam stream_T type of the filestream
 * @param filepath path to the file
 * @return input file stream object
 */
template <typename stream_T>
stream_T touch_file(const char *filepath)
{
    stream_T file(filepath, std::ios::binary);

    if (!file.is_open())
    {
        std::cerr << "Could not open/read file " << filepath << std::endl;
        exit(1);
    }

    return file;
}