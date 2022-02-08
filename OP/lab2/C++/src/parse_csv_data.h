#include <fstream>
#include <sstream>
#include "usings.h"

/**
 * @brief Parses the content of the csv file into a 2D vector:
 * {{name, birthday, workSince}, ...}, where each subarray is a
 * single line in the original file.
 *
 * @param FILE reference to the original file
 * @return 2D vector of strings
 */
vector<vector<string>> parse_csv_data(std::ifstream &FILE)
{
    string line, block;
    vector<vector<string>> content;

    /**
     * 1) Read every line in the file.
     * 2) Extract words, separated in the line by a comma using stringstream and getline with separator.
     * 3) Store each word in a vector `row` and each this vector is stored in a 2D vector `content`
     */
    while (std::getline(FILE, line))
    {
        vector<string> row;

        std::stringstream str(line);

        while (std::getline(str, block, ','))
            row.push_back(block);

        content.push_back(row);
    }

    return content;
}