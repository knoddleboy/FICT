/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #1, var 15
 *
 * @date 05.02.2022
 */

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <vector>
#include <ctime>
#include <cmath>

using std::string;
using std::vector;

vector<vector<string>> parse_csv_data(std::ifstream &);
size_t number_of_workers_over_40(vector<vector<string>> &);
size_t date_to_age(vector<vector<string>> &, size_t, size_t);

int main()
{
    std::ifstream company_data("../assets/companyData.csv");
    if (!company_data.is_open())
    {
        std::cerr << "Exception opening/reading file" << std::endl;
        return 1;
    }

    vector<vector<string>> csv_file_content = parse_csv_data(company_data);

    size_t over_40 = number_of_workers_over_40(csv_file_content);

    company_data.close();
    std::cin.get();
    return 0;
}

/**
 * @brief Parses the content of the csv file into a 2D vector:
 * {{name, birthday, workSince}, ...}, where each subarray is a
 * single line in the original file.
 *
 * @param FILE reference to the file
 * @return 2D vector of strings
 */
vector<vector<string>> parse_csv_data(std::ifstream &FILE)
{
    string line, block;
    vector<string> current_line;
    vector<vector<string>> content;

    /**
     * 1) Read every line in the file.
     * 2) Extract words, separated in the line by a comma using stringstream
     *
     */
    while (std::getline(FILE, line))
    {
        current_line.clear();

        std::stringstream str(line);

        while (std::getline(str, block, ','))
            current_line.push_back(block);

        content.push_back(current_line);
    }

    return content;
}

size_t number_of_workers_over_40(vector<vector<string>> &csv_content)
{
    size_t workers_over_40 = 0;
    time_t today = time(0);

    for (size_t i = 0; i < csv_content.size(); i++)
        for (size_t j = 0; j < csv_content[i].size(); j++)
        {
            if (j == 1)
            {
                size_t birthday = date_to_age(csv_content, i, j);

                // std::cout << birthday << std::endl;

                workers_over_40++;
            }
        }

    return 0;
}

/**
 * @brief Converts birthday date of format DD.MM.YYYY to age
 *
 * @param csv_content file line captured into array of strings: {name, birthday, workSince}
 * @param i file line index
 * @param j birthday date index
 * @return { size_t } age
 */
size_t date_to_age(vector<vector<string>> &csv_content, size_t i, size_t j)
{
    struct tm date = {0}; // Declaring `ctime` date

    /**
     * Since input vector is of type `string`, form days, months and years of the date
     * converting every number to the type of `number`.
     *
     * Third indices represent current number in date: 00.00.0000
     */
    size_t days = (csv_content[i][j][0] - '0') * 10 + (csv_content[i][j][1] - '0') * 1;
    date.tm_mday = days;

    size_t months = (csv_content[i][j][3] - '0') * 10 + (csv_content[i][j][4] - '0') * 1;
    date.tm_mon = months - 1; // month correction

    size_t years = 0;
    for (size_t k = 0; k < 4; k++)
        years += (csv_content[i][j][k + 6] - '0') * pow(10, 3 - k);
    date.tm_year = years - 1900; // year correction

    time_t formated_birthday_date = mktime(&date); // Interpret date struct to a `date` format

    /**
     * time(NULL) returns today's date, represented in seconds
     */
    return (difftime(time(NULL), formated_birthday_date) + 86400L / 2) / 86400L / 365;
}