/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #2, var 15
 *
 * @date 15.02.2022
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

std::fstream touch_file(const char *);
void insert_data_into_csv(std::fstream &);
vector<vector<string>> parse_csv_data(std::fstream &);
vector<string> workers_list_conditionally(vector<vector<string>> &, size_t);
size_t date_to_years(vector<vector<string>> &, size_t, size_t);
void print_results(vector<string> &, size_t);
void remove_less_than_year(const char *, const char *, vector<vector<string>> &);

int main()
{
    const char *input_file_path = "../../assets/company_data.csv";
    const char *tempfile_path = "../../assets/output.csv";

    std::fstream input_file = touch_file(input_file_path);

    insert_data_into_csv(input_file);

    /** Extract words from each line to 2D vector */
    vector<vector<string>> csv_file_content = parse_csv_data(input_file);

    /** Get the number of workers over 40 years */
    vector<string> workers_over_40_years = workers_list_conditionally(csv_file_content, 1);
    print_results(workers_over_40_years, 1);

    /** Get the number of workers who works 20 and more years */
    vector<string> workers_working_20_years = workers_list_conditionally(csv_file_content, 2);
    print_results(workers_working_20_years, 2);

    input_file.close(); // be sure to close stream before removing file data

    /** Remove info about workers working less than a year */
    remove_less_than_year(input_file_path, tempfile_path, csv_file_content);

    std::cin.get();
    return 0;
}

/**
 * @brief Creates input file stream
 *
 * @param filepath path to the file to be touched
 * @return input file stream object
 */
std::fstream touch_file(const char *filepath)
{
    std::fstream file(filepath, std::fstream::in | std::fstream::out | std::fstream::trunc | std::fstream::binary);

    if (!file.is_open())
    {
        std::cerr << "Could not open/read file " << filepath << std::endl;
        exit(1);
    }

    file.clear();

    return file;
}

/**
 * @brief Translates cin input into input file
 *
 * @param input_file reference to the input file stream
 */
void insert_data_into_csv(std::fstream &input_file)
{
    string line; // represents current line in the file stream

    /** Take input from cin to the file until EOF */
    std::cout << "Enter file data:" << std::endl;
    while (std::getline(std::cin, line))
        input_file << line << std::endl;

    input_file.clear();
}

/**
 * @brief Parses the content of the csv file into a 2D vector:
 * {{name, birthday, workSince}, ...}, where each subarray is a
 * single line in the original file (splitted).
 *
 * @param input_file reference to the original file
 * @return 2D vector of strings
 */
vector<vector<string>> parse_csv_data(std::fstream &input_file)
{
    string line, block;
    vector<vector<string>> content;

    input_file.seekg(0, std::ios::beg);

    /**
     * Since input line is of the form "Full Name,DD.MM.YYYY,DD.MM.YYYY", we need to parse all the
     * data from it i.e. full name and two dates. Thus we need a container such as std::vector to
     * store the data but as we would probably have several lines of the data, we should
     * store the info into 2D vector of the form: {{name, birthday, workSince}, ...}.
     *
     * TODO:
     * 1) Read every line in the file.
     * 2) Extract words, separated in the line by a comma:
     *      - iterate through the line with find method with a comma delimiter;
     *      - once a comma is found - push a substring-word into a `row` and erase it from string,
     *        then push remaining word. The row on each iteration is {name, birthday, workSince};
     *      - store each `row` in the `content` vector.
     */
    while (std::getline(input_file, line))
    {
        vector<string> row;
        size_t pos = 0; // current position in the line

        while ((pos = line.find(',')) != string::npos) // compare with npos to guarantee that
        {                                              // find still seeking for the delimiter
            row.push_back(line.substr(0, pos));
            line.erase(0, pos + 1);
        }

        row.push_back(line); // push last substring

        content.push_back(row);
    }

    input_file.clear();

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
 * @brief Removes from input file information about workers working less than a year.
 *
 * @param input_file_path path to the original file
 * @param temp_file_path path to the temp file to be replaced with original
 * @param csv_content file line captured into array of strings: {name, birthday, workSince}
 */
void remove_less_than_year(const char *input_file_path, const char *temp_file_path, vector<vector<string>> &csv_content)
{
    std::ofstream TEMP_OUTPUT_FILE(temp_file_path);

    /** Write to output file lines of only those workers, who work more than a year */
    for (size_t i = 0; i < csv_content.size(); i++)
    {
        if (date_to_years(csv_content, i, 2) >= 1)
            TEMP_OUTPUT_FILE << csv_content[i][0] << ',' << csv_content[i][1] << ',' << csv_content[i][2] << std::endl;
    }

    TEMP_OUTPUT_FILE.close();

    remove(input_file_path);
    rename(temp_file_path, input_file_path);

    std::cout << "\n[ " << input_file_path << " ] is successfully overwritted!" << std::endl;
}