#include "../headers/MaterialPoint.h"
#include "../headers/generate_value.h"

MaterialPoint::MaterialPoint()
{
    for (size_t i = 0; i < 3; i++)
    {
        m_coords[i] = generate_value();
        m_vectors[i] = generate_value();
    }
}

/**
 * @brief Move a point in space using formula: x = x0 + v0 * t
 *
 * @param time time
 */
void MaterialPoint::update_point_position(double &time)
{
    for (size_t i = 0; i < 3; i++)
        m_coords[i] += m_vectors[i] * time;
}