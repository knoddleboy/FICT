#include <iostream>

#include "../headers/utils.h"

/**
 * @brief Generate a float number
 *
 * @param min minimal value
 * @param max maximal value
 * @return Pseudorandom number
 */
double rand_range(double min, double max)
{
    return (double)rand() / RAND_MAX * (max - min) + min;
}