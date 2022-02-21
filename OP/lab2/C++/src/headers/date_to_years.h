#pragma once

#include "struct.h"

#include <algorithm>
#include <sstream>
#include <string>
#include <vector>
#include <ctime>

using std::string;
using std::vector;

/**
 * @brief Converts birthday date of format DD.MM.YYYY to age N.
 *
 * @param file_content file line captured into vector of structs: {name, age, works}
 * @param file_line_idx index of the struct in the vector
 * @param date_idx index of the date to get from struct: 0 represents age, 1 – working years
 * @return age in years
 */
size_t date_to_years(vector<FileData> &file_content, size_t file_line_idx, size_t date_idx)
{
    struct tm date = {0}; // Declaring `ctime` date struct

    size_t days, months, years;

    /** Take string date of the format `DD.MM.YYYY` and remove periods to get `DD MM YYYY` */
    string string_date = (date_idx == 0) ? file_content[file_line_idx].age : file_content[file_line_idx].works;

    replace(string_date.begin(), string_date.end(), '.', ' ');

    /** Extract each number using stringstream into corresponding variables */
    std::istringstream(string_date) >> days >> months >> years;

    date.tm_mday = days;
    date.tm_mon = months - 1;    // month correction
    date.tm_year = years - 1900; // year correction

    time_t formated_birthday_date = mktime(&date); // Birthday in unix time

    /** Returns date, represented in years. */
    return (difftime(time(NULL), formated_birthday_date) + 86400L / 2) / 86400L / 365;
}