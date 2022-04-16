#pragma once

/**
 * @brief Generate a number of type T
 *
 * @tparam T a number type
 * @param min minimal value
 * @param max maximal value
 * @return Pseudorandom number
 */
template <typename T = double>
T generate_value(T min = -20.0, T max = 20.0)
{
    return (T)rand() / RAND_MAX * (max - min) + min;
}