#pragma once

class MaterialPoint
{
private:
    /* Point's coordinates. Entries order: {x, y, z} */
    double m_coords[3];

    /* Velocity vector coordinates. Entries order: {vx, vy, vz} */
    double m_vectors[3];

public:
    MaterialPoint(double x, double y, double z, double vx, double vy, double vz) : m_coords{x, y, z}, m_vectors{vx, vy, vz} {};
    MaterialPoint();
    double const *get_coords() const { return m_coords; };
    void update_point_position(double &time);
};