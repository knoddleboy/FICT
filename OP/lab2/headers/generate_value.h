#pragma once

#include <cstdlib>

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