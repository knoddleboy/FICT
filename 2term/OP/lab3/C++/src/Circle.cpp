#include "../headers/Circle.h"

Circle::Circle(double radius, const double center[2])
{
    m_radius = radius;
    for (size_t i = 0; i < 2; ++i)
        m_center[i] = center[i];
}

std::ostream &operator<<(std::ostream &out, const Circle &circle)
{
    out << "Circle(R = " << circle.m_radius << ", (" << circle.m_center[0] << "; " << circle.m_center[1] << "))";
    return out;
}

Circle &Circle::operator++()
{
    this->m_center[0]++;
    return *this;
}

Circle Circle::operator++(int)
{
    // Create temporary copy of the object
    Circle temp(*this);

    this->m_center[1]++;

    // Return temp object
    return temp;
}

Circle operator*(const Circle &circle, double value)
{
    return Circle(circle.m_radius * value, circle.m_center);
}