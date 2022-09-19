cmake_minimum_required(VERSION 3.0.0)
project(lab3 VERSION 0.1.0)

add_executable(lab3 src/main.cpp src/Circle.cpp src/utils.cpp headers/Circle.h headers/utils.h)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
