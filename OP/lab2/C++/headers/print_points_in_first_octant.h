#pragma once

#include <iostream>
#include <vector>

#include "MaterialPoint.h"
#include "verify_first_octant.h"

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