#pragma once

#include "struct.h"

#include <fstream>
#include <string>
#include <vector>

#include "touch_file.h"
#include "read_write_data.h"

using std::string;
using std::vector;

/**
 * @brief Translates cin input into the file through a struct, previously serializing
 * (i.e. removing commas).
 *
 * @param input_file_path path to the file
 */
void cin_input_into_file(const char *input_file_path)
{
    /** Open file stream */
    std::ofstream input_file = touch_file<std::ofstream>(input_file_path);

    /* ========================================================================= */
    /* ========== Parse strings from cin input into vector of structs ========== */
    /* ========================================================================= */

    string line; // line in the file stream

    /** Array of structs, each of which represents current line's data */
    vector<FileData> File_serialized;

    /**
     * Since input line is of the form "Full Name,DD.MM.YYYY,DD.MM.YYYY", we need to parse all the
     * data from it i.e. full name and two dates. Thus we need a container such as struct to
     * store the data but as we would probably have several lines of the data, we should
     * store the info into vector such as `vector<FileData>`. So we'd have a vector of structs:
     * [{name, age, works}, ...].
     *
     * TODO:
     * 1) Read every line in the file with std::getline.
     * 2) Extract words, separated in the line by commas:
     *      - iterate through the line with find method with a comma delimiter;
     *      - once a comma is found - push a substring-word into a `row` vector and erase it from string.
     *        The remaining word would be the line. The row on each iteration is [name, age];
     *      - then push each `row` into the `vector<FileData>`.
     */
    std::cout << "Enter file data:" << std::endl;
    while (std::getline(std::cin, line))
    {
        vector<string> row;
        size_t pos = 0; // current position in the line

        /** Compare with npos to guarantee that `find` still seeking for the delimiter */
        while ((pos = line.find(',')) != string::npos)
        {
            row.push_back(line.substr(0, pos));
            line.erase(0, pos + 1);
        }

        File_serialized.push_back({row[0], row[1], line});
    }

    /* ========================================================================= */
    /* ================= Write each vector's struct into file ================== */
    /* ========================================================================= */

    for (const auto &data_unit : File_serialized)
        write<std::ofstream>(input_file, data_unit.full_name, data_unit.age, data_unit.works);

    input_file.clear();
    input_file.close();
}