#pragma once

#include "MaterialPoint.h"

/**
 * @brief Calculates in which octant of the 3D space the provided point is.
 * For instance if coordinates are {1, 2, 3}, then the point is in the first octant.
 *
 * @param point material point with defined coordinates
 * @return octant number
 */
bool verify_first_octant(MaterialPoint const &point)
{
    const auto *point_coords = point.get_coords();
    if (point_coords[0] >= 0 && point_coords[1] >= 0 && point_coords[2] >= 0)
        return true;
    return false;
}