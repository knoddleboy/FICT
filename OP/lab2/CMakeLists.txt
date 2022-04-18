cmake_minimum_required(VERSION 3.0.0)
project(lab2 VERSION 0.1.0)

include(CTest)
enable_testing()

add_executable(lab2 src/main.cpp src/MaterialPoint.cpp headers/generate_value.h headers/MaterialPoint.h headers/print_points_in_first_octant.h headers/show_coords_table.h headers/verify_first_octant.h)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
