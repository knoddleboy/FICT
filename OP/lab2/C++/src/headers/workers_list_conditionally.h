#pragma once

#include "struct.h"

#include <string>
#include <vector>

#include "date_to_years.h"

using std::string;
using std::vector;

/**
 * @brief Select workers based on the condition (=== branch of the task).
 *
 * @param file_content file line captured into vector of structs: {name, age, works}
 * @param condition condition to select: 0 represents amount of workers over 40 years, 1 – over 20 years
 * @return Vector of selected workers
 */
vector<string> workers_list_conditionally(vector<FileData> &file_content, size_t condition)
{
    // Will contain names of selected workers
    vector<string> workers_list;

    for (size_t i = 0; i < file_content.size(); i++)
    {
        if (condition == 0)
        {
            if (date_to_years(file_content, i, condition) > 40)
                workers_list.push_back(file_content[i].full_name);
        }
        else if (condition == 1)
        {
            if (date_to_years(file_content, i, condition) >= 20)
                workers_list.push_back(file_content[i].full_name);
        }
    }

    return workers_list;
}