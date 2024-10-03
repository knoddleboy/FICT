/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #3, var 15
 *
 * @date 19.04.2022
 */

#include <iostream>
#include <ctime>

#include "../headers/MaterialPoint.h"
#include "../headers/utils.h"

int main()
{
    srand((unsigned)time(NULL));

    double time;
    do
    {
        std::cout << "Time in seconds: ";
        std::cin >> time;
    } while (time < 0);

    size_t number_of_points;
    do
    {
        std::cout << "The number of points: ";
        std::cin >> number_of_points;
        std::cin.get();
    } while (number_of_points < 0);

    // Create vector of points
    std::vector<MaterialPoint> material_points;
    for (size_t i = 0; i < number_of_points; i++)
        material_points.push_back(MaterialPoint());

    // Print points after initialization
    show_coords_table(material_points, "Points");

    // Change points position
    for (auto &point : material_points)
        point.update_point_position(time);

    // Print points after updating their position
    show_coords_table(material_points, "Moved points");

    // Print points that moved into the first octant
    print_points_in_first_octant(material_points);

    std::cin.get();
    return 0;
}