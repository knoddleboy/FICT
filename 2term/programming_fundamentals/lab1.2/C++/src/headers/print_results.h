#pragma once

#include <iostream>
#include <iomanip>
#include <string>
#include <vector>

using std::string;
using std::vector;

/**
 * @brief Display data about workers, selected according to condition of the task.
 *
 * @param chosen_workers list of selected workers
 * @param condition condition to select: 0 represents amount of workers over 40 years, 1 – over 20 years
 */
void print_results(vector<string> &chosen_workers, size_t condition)
{
    size_t total_amount;
    if (condition == 0)
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
    else if (condition == 1)
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