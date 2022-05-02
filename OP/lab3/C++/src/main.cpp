#include <iostream>

#include "../headers/Circle.h"
#include "../headers/utils.h"

int main()
{
    Circle C1; // using default constructor
    std::cout << "C1 (default): " << C1 << "\n";

    double r2, r3, center2[2], center3[2];

    /* Initialize C2 Circle with received radius and center coords*/

    std::cout << "\nEnter C2 radius and center coords (x and y): ";
    std::cin >> r2 >> center2[0] >> center2[1];

    Circle C2(r2, center2); // using constructor with parameters
    std::cout << "C2: " << C2 << "\n";

    /* Initialize C3 Circle with received radius and center coords*/

    std::cout << "\nEnter C3 radius and center coords (x and y): ";
    std::cin >> r3 >> center3[0] >> center3[1];

    Circle C3 = Circle(r3, center3); // using constructor with copying initialization
    std::cout << "C3: " << C3 << "\n\n";

    std::cout << "--------------------------------\n\n";

    /* Perform increments for C1 & C2 and multiplication for C3 */

    std::cout << "C1 x incremented: " << ++C1 << "\n";
    std::cout << "C2 y incremented: " << C2++ << " -> " << C2 << "\n";
    std::cout << "C3 scaled: " << C1 * 3 << "\n";

    std::cout << "\nCircle with longest circumference: " << find_largest_circle(C1, C2, C3) << "\n";

    return 0;
}