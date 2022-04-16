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
    const char *original_file_path = "../../assets/original.txt";
    const char *output_file_path = "../../assets/output.txt";

    /** Create original file on write-only mode and fill it */
    std::fstream original_file = touch_file(original_file_path);
    fill_original_file(original_file);

    /** Create output file in write-only mode */
    std::fstream output_file = touch_file(output_file_path);

    /** Open original file in read-only mode and copy all the data to the `output_file` */
    copy_original_file_data(original_file, output_file);

    /** Display files' content */
    display_files(original_file, output_file);

    original_file.close();
    output_file.close();

    std::cin.get();
    return 0;
}