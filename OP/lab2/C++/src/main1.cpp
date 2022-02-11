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

struct FileData
{
    string full_name;
    string age;
    string works;
};

template <typename stream_T>
stream_T touch_file(const char *);

void cin_input_into_file(const char *);
void read_file(const char *);

int main()
{
    const char *input_file_path = "../../assets/company_data.dat";

    cin_input_into_file(input_file_path);

    read_file(input_file_path);

    return 0;
}

/**
 * @brief Creates input file stream
 *
 * @param filepath path to the file to be touched
 * @return input file stream object
 */
template <typename stream_T>
stream_T touch_file(const char *filepath)
{
    stream_T file(filepath, std::ios::binary);

    if (!file.is_open())
    {
        std::cerr << "Could not open/read file " << filepath << std::endl;
        exit(1);
    }

    return file;
}

void cin_input_into_file(const char *input_file_path)
{
    /** Open file stream */
    std::ofstream input_file = touch_file<std::ofstream>(input_file_path);

    string line; // represents current line in the file stream

    vector<FileData> File_serialized;

    /** Take input from cin to the file until EOF */
    std::cout << "Enter file data:" << std::endl;
    while (std::getline(std::cin, line))
    {
        vector<string> row;
        size_t pos = 0; // current position in the line

        while ((pos = line.find(',')) != string::npos) // compare with npos to guarantee that
        {                                              // find still seeking for the delimiter
            row.push_back(line.substr(0, pos));
            line.erase(0, pos + 1);
        }

        File_serialized.push_back({row[0], row[1], line});
    }

    for (const auto &data_unit : File_serialized)
        input_file.write(reinterpret_cast<const char *>(&data_unit), sizeof(data_unit));

    input_file.close();
}

void read_file(const char *input_file_path)
{
    std::ifstream input_file = touch_file<std::ifstream>(input_file_path);

    input_file.seekg(0, std::ios::beg);

    FileData temp;
    while (input_file.read(reinterpret_cast<char *>(&temp), sizeof(FileData)))
    {
        std::cout << temp.full_name << ' ' << temp.age << ' ' << temp.works << std::endl;
    }

    input_file.close();
}