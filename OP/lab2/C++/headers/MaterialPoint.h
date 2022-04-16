#pragma once

#include "generate_value.h"

class MaterialPoint
{
private:
    /* Point's coordinates. Entries order: {x, y, z} */
    double m_coords[3];

    /* Velocity vector coordinates. Entries order: {vx, vy, vz} */
    double m_vectors[3];

public:
    MaterialPoint()
    {
        for (size_t i = 0; i < 3; i++)
        {
            m_coords[i] = generate_value();
            m_vectors[i] = generate_value();
        }
    };
    double const *get_coords() const { return m_coords; };

    /**
     * @brief Move a point in space using formula: x = x0 + v0 * t
     *
     * @param time time
     */
    void update_point_position(double &time)
    {
        for (size_t i = 0; i < 3; i++)
            m_coords[i] += m_vectors[i] * time;
    };
};