#include <iostream>
#include <iomanip>
#include <vector>

#define GENERATE_VALUE_H

#include "../headers/utils.h"
#include "../headers/MaterialPoint.h"

/**
 * @brief Generate a number of type T
 *
 * @tparam T a number type
 * @param min minimal value
 * @param max maximal value
 * @return Pseudorandom number
 */
double generate_value(double min = -20.0, double max = 20.0)
{
    return (double)rand() / RAND_MAX * (max - min) + min;
}

/**
 * @brief Prints indices of the points in vector that moved into
 * the first octant after position changing.
 *
 * @param points vector of points
 */
void print_points_in_first_octant(std::vector<MaterialPoint> const &points)
{
    std::cout << "\nPoints that moved into the first octant:";

    size_t in_first_octant = 0; // Total points in the first octant

    for (size_t i = 0; i < points.size(); i++)
    {
        if (verify_first_octant(points[i]))
        {
            std::cout << ' ' << i + 1 << ",";
            ++in_first_octant;
        }
    }

    in_first_octant
        ? std::cout << '\b' << '.' << std::endl
        : std::cout << " none." << std::endl;
}

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

/**
 * @brief Defines whether the provided point is in the first octant i.e. x, y and z are all positive.
 *
 * @param point material point with defined coordinates
 * @return in the first octant or not
 */
bool verify_first_octant(MaterialPoint const &point)
{
    const auto *point_coords = point.get_coords();
    return (point_coords[0] >= 0 && point_coords[1] >= 0 && point_coords[2] >= 0) ? true : false;
}