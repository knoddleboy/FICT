/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #2, var 15
 *
 * @date 22.02.2022
 */

#include "headers/touch_file.h"
#include "headers/read_write_data.h"
#include "headers/cin_input_into_file.h"
#include "headers/parse_file_data.h"
#include "headers/workers_list_conditionally.h"
#include "headers/print_results.h"
#include "headers/remove_less_than_year.h"

int main()
{
    const char *input_file_path = "../../assets/company_data.dat";
    const char *tempfile_path = "../../assets/output.dat";

    // Extract content from cin into the file
    cin_input_into_file(input_file_path);

    // Extract words from each line of the file into the vector of structs
    vector<FileData> file_content = parse_file_data(input_file_path);

    // Get the number of workers over 40 years
    vector<string> workers_over_40_years = workers_list_conditionally(file_content, 0);
    print_results(workers_over_40_years, 0);

    // Get the number of workers who work 20 and more years
    vector<string> workers_working_20_years = workers_list_conditionally(file_content, 1);
    print_results(workers_working_20_years, 1);

    // Remove info about workers working less than a year
    remove_less_than_year(input_file_path, tempfile_path, file_content);

    system("pause");
    return 0;
}