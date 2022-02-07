/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #1, var 15
 *
 * @date 08.02.2022
 */

#include "./headers/dependencies.h"

#include "./headers/touch_file.h"
#include "./headers/fill_original_file.h"
#include "./headers/copy_original_file_data.h"
#include "./headers/display_files.h"

int main()
{
    const char *original_filepath = "../../assets/original.txt";
    const char *output_filepath = "../../assets/output.txt";

    /** Create original file and set write-only stream */
    std::ofstream original_file = touch_file<std::ofstream>(original_filepath);
    fill_original_file(original_file);
    original_file.close();

    /** Create output file and set write-only stream */
    std::ofstream output_file = touch_file<std::ofstream>(output_filepath);

    /** Open original file in read-only mode and copy all the data to the `output_file` */
    copy_original_file_data(
        touch_file<std::ifstream>(original_filepath),
        output_file);
    output_file.close();

    /** Display files' content */
    display_files(
        touch_file<std::ifstream>(original_filepath),
        touch_file<std::ifstream>(output_filepath));

    original_file.close();
    output_file.close();

    std::cin.get();
    return 0;
}