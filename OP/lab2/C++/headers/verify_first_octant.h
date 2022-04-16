#pragma once

#include "MaterialPoint.h"

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