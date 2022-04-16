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

#include "headers/generate_value.h"
#include "headers/MaterialPoint.h"
#include "headers/print_points_in_first_octant.h"
#include "headers/show_coords_table.h" < / ctime>

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
    } while (number_of_points < 0);

    // Create vector of points
    std::vector<MaterialPoint> material_point;
    for (size_t i = 0; i < number_of_points; i++)
        material_point.push_back(MaterialPoint());

    // Print points after initialization
    show_coords_table(material_point, "Points");

    // Change points position
    for (auto &point : material_point)
        point.update_point_position(time);

    // Print points after updating their position
    show_coords_table(material_point, "Points over time");

    // Print points that moved into the first octant
    print_points_in_first_octant(material_point);

    std::cin.get();
    return 0;
}