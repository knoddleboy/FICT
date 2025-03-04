cmake_minimum_required(VERSION 3.10)
project(Lab3)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

include_directories(${CMAKE_SOURCE_DIR}/common)
set(COMMON_SOURCES ${CMAKE_SOURCE_DIR}/common/print_addr.c)

add_executable(client ${CMAKE_SOURCE_DIR}/client/client.c ${COMMON_SOURCES})
set_target_properties(client PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/client)

add_executable(server ${CMAKE_SOURCE_DIR}/server/server.c ${COMMON_SOURCES})
set_target_properties(server PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/server)

add_executable(server_fork ${CMAKE_SOURCE_DIR}/server/server_fork.c ${COMMON_SOURCES})
set_target_properties(server_fork PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/server)

add_executable(server_prefork ${CMAKE_SOURCE_DIR}/server/server_prefork.c ${COMMON_SOURCES})
set_target_properties(server_prefork PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/server)