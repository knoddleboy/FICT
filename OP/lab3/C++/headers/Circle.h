#pragma once

#include <iostream>

class Circle
{
private:
    static constexpr double m_PI = 3.14159;

    // m_center represents an array of coordinates of the form {x, y}
    double m_radius, m_center[2];

public:
    Circle() : m_radius(1), m_center{0, 0} {};
    Circle(double radius, const double center[2]);

    double const get_radius() const { return m_radius; };
    double *const get_center() { return m_center; };
    double const get_circumference() const { return 2 * m_PI * m_radius; };

    friend std::ostream &operator<<(std::ostream &out, const Circle &circle);

    Circle &operator++();   // prefix increment for incrementing center's x coordinate
    Circle operator++(int); // postfix increment for incrementing center's y coordinate
    friend Circle operator*(const Circle &circle, double value);
};