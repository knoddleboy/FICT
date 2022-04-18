#pragma once

#include <iostream>
#include <iomanip>
#include <vector>
#include <string>

#include "MaterialPoint.h"

/**
 * @brief Displays a table of points' coordinates and vectors.
 *
 * @param points vector of points
 * @param header_title table title
 */
void show_coords_table(std::vector<MaterialPoint> const &points, std::string header_title)
{
    size_t header_title_size = header_title.size();
    size_t hypens = (26 - header_title_size) / 2;
    std::cout << "\n+--+" << std::setfill('-') << std::setw(hypens + header_title_size) << header_title << std::setw(hypens + 2) << "+\n"
              << std::setfill(' ');

    size_t point_counter = 1;
    for (auto &point : points)
    {
        std::cout << "|" << std::setw(2) << point_counter << "| (" << std::setprecision(3)
                  << std::setw(6) << point.get_coords()[0] << ", "
                  << std::setw(6) << point.get_coords()[1] << ", "
                  << std::setw(6) << point.get_coords()[2] << ") |\n";
        ++point_counter;
    }
    std::cout << "+--+--------------------------+\n";
}