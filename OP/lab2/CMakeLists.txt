cmake_minimum_required(VERSION 3.0.0)
project(lab2 VERSION 0.1.0)

include(CTest)
enable_testing()

add_executable(lab2 src/main.cpp src/MaterialPoint.cpp src/utils.cpp headers/MaterialPoint.h headers/utils.h)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
