/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #1, var 15
 *
 * @date 08.02.2022
 */

#include <algorithm>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <ctime>
#include <cmath>

using std::string;
using std::vector;

vector<vector<string>> parse_csv_data(std::ifstream &);
vector<string> workers_list_conditionally(vector<vector<string>> &, size_t);
size_t date_to_years(vector<vector<string>> &, size_t, size_t);
void print_results(vector<string> &, size_t);
void remove_less_than_year(std::ifstream &, const char *, const char *, vector<vector<string>> &);

int main()
{
    const char *filepath = "../assets/companyData.csv";
    const char *output_tempfile_path = "../assets/output.csv";

    /** Original file read-only stream */
    std::ifstream company_data(filepath);
    if (!company_data.is_open())
    {
        std::cerr << "Could not open/read file" << std::endl;
        exit(1);
    }

    /** Extract words from each line to 2D vector */
    vector<vector<string>> csv_file_content = parse_csv_data(company_data);

    /** Get the number of workers over 40 years */
    vector<string> workers_over_40_years = workers_list_conditionally(csv_file_content, 1);
    print_results(workers_over_40_years, 1);

    /** Get the number of workers who works 20 and more years */
    vector<string> workers_working_20_years = workers_list_conditionally(csv_file_content, 2);
    print_results(workers_working_20_years, 2);

    /** Remove info about workers working less than a year */
    remove_less_than_year(company_data, filepath, output_tempfile_path, csv_file_content);

    if (company_data.is_open())
        company_data.close();

    std::cin.get();
    return 0;
}

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

/**
 * @brief Select workers based on the condition (=== branch of the task).
 *
 * @param csv_content file line captured into array of strings: {name, birthday, workSince}
 * @param condition condition to select
 * @return Vector array of selected workers
 */
vector<string> workers_list_conditionally(vector<vector<string>> &csv_content, size_t condition)
{
    /** Will be containing names of selected workers */
    vector<string> workers_list;

    for (size_t i = 0; i < csv_content.size(); i++)
    {
        if (condition == 1)
        {
            if (date_to_years(csv_content, i, condition) > 40)
                workers_list.push_back(csv_content[i][0]);
        }
        else if (condition == 2)
        {
            if (date_to_years(csv_content, i, condition) >= 20)
                workers_list.push_back(csv_content[i][0]);
        }
    }

    return workers_list;
}

/**
 * @brief Converts birthday date of format DD.MM.YYYY to age.
 *
 * @param csv_content file line captured into array of strings: {name, birthday, workSince}
 * @param file_line_idx file line index
 * @param date_idx index of the info to get from file
 * @return { size_t } age
 */
size_t date_to_years(vector<vector<string>> &csv_content, size_t file_line_idx, size_t date_idx)
{
    struct tm date = {0}; // Declaring `ctime` date struct

    size_t days, months, years;

    /** Take string date of the format `DD.MM.YYYY` and remove periods to get `DD MM YYYY` */
    string string_date = csv_content[file_line_idx][date_idx];
    replace(string_date.begin(), string_date.end(), '.', ' ');

    /** Extract each number using stringstream into corresponding variables */
    std::istringstream(string_date) >> days >> months >> years;

    date.tm_mday = days;
    date.tm_mon = months - 1;    // month correction
    date.tm_year = years - 1900; // year correction

    time_t formated_birthday_date = mktime(&date); // Interpret date struct to a `date` format

    /** time(NULL) returns today's date, represented in seconds. */
    return (difftime(time(NULL), formated_birthday_date) + 86400L / 2) / 86400L / 365;
}

/**
 * @brief Display data about workers, selected according to condition of the task.
 *
 * @param chosen_workers selected workers
 * @param condition branch of the task
 */
void print_results(vector<string> &chosen_workers, size_t condition)
{
    size_t total_amount;
    if (condition == 1)
    {
        total_amount = 0;
        std::cout << "\n+---------------------------+\n"
                  << "| Workers over 40 years:    |\n"
                  << "+---------------------------+\n";

        for (size_t i = 0; i < chosen_workers.size(); i++)
        {
            std::cout << "| " << std::left << std::setw(25) << chosen_workers[i] << std::right << std::setw(2) << " |\n";
            total_amount++;
        }
        std::cout << "| In total:" << std::right << std::setw(16) << total_amount << " |\n";
        std::cout << "+---------------------------+\n";
    }
    else if (condition == 2)
    {
        total_amount = 0;
        std::cout << "\n+---------------------------+\n"
                  << "| Work 20 and more years:   |\n"
                  << "+---------------------------+\n";

        for (size_t i = 0; i < chosen_workers.size(); i++)
        {
            std::cout << "| " << std::left << std::setw(25) << chosen_workers[i] << std::right << std::setw(2) << " |\n";
            total_amount++;
        }
        std::cout << "| In total:" << std::right << std::setw(16) << total_amount << " |\n";
        std::cout << "+---------------------------+\n";
    }
}

/**
 * @brief Removes from `FILE` information about workers working less than a year.
 *
 * @param FILE reference to the original file
 * @param csv_content file line captured into array of strings: {name, birthday, workSince}
 */
void remove_less_than_year(
    std::ifstream &FILE,
    const char *orig_file_path,
    const char *output_path,
    vector<vector<string>> &csv_content)
{
    std::ofstream OUTPUT_FILE(output_path);

    /** Write to output file lines of only those workers, who work more than a year */
    for (size_t i = 0; i < csv_content.size(); i++)
    {
        if (date_to_years(csv_content, i, 2) >= 1)
            OUTPUT_FILE << csv_content[i][0] << ',' << csv_content[i][1] << ',' << csv_content[i][2] << std::endl;
    }

    FILE.close();
    OUTPUT_FILE.close();

    remove(orig_file_path);
    rename(output_path, orig_file_path);

    std::cout << "\n[ " << orig_file_path << " ] is successfully overwritted!" << std::endl;
}