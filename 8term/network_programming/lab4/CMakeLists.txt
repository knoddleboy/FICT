cmake_minimum_required(VERSION 3.10)
project(Lab3)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include_directories(${CMAKE_SOURCE_DIR}/common)
set(COMMON_SOURCES ${CMAKE_SOURCE_DIR}/common/print_addr.c)

add_executable(client ${CMAKE_SOURCE_DIR}/client/main.c ${COMMON_SOURCES})
set_target_properties(client PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/client)

add_executable(server ${CMAKE_SOURCE_DIR}/server/main.c ${COMMON_SOURCES})
set_target_properties(server PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/server)