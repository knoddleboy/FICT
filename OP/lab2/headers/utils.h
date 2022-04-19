#include <vector>
#include <string>

#include "MaterialPoint.h"

// Includes into the MaterialPoint.cpp
#ifndef GENERATE_VALUE_H
#define GENERATE_VALUE_H
double generate_value(double min = -20.0, double max = 20.0);
#endif

// Includes into the utils.h
#ifndef UTILS_H
#define UTILS_H
void print_points_in_first_octant(std::vector<MaterialPoint> const &);
void show_coords_table(std::vector<MaterialPoint> const &, std::string);
bool verify_first_octant(MaterialPoint const &);
#endif