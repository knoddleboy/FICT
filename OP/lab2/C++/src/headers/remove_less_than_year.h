#pragma once

#include "struct.h"

#include <fstream>
#include <vector>

#include "touch_file.h"
#include "date_to_years.h"
#include "read_write_data.h"

using std::vector;

/**
 * @brief Removes from input file information about workers working less than a year.
 *
 * @param input_file_path path to the original file
 * @param temp_file_path path to the temp file to be replaced with original
 * @param file_content file line captured into vector of structs: {name, age, works}
 */
void remove_less_than_year(const char *input_file_path, const char *temp_file_path, vector<FileData> &file_content)
{
    std::ofstream temp_file = touch_file<std::ofstream>(temp_file_path);

    /** Write to output file lines of only those workers, who work more than a year */
    for (size_t i = 0; i < file_content.size(); i++)
    {
        if (date_to_years(file_content, i, 2) >= 1)
            write(temp_file, file_content[i].full_name, file_content[i].age, file_content[i].works);
    }

    temp_file.close();

    remove(input_file_path);
    rename(temp_file_path, input_file_path);

    std::cout << "\n[ " << input_file_path << " ] is successfully overwritted!" << std::endl;
}