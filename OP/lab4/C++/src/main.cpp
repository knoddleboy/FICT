/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #4, var 15

 * @date 24.05.2022
 *
 */

#include <iostream>
#include <ctime>
#include <vector>
#include <string>

using std::string;
using std::vector;

#include "../headers/TFunction.h"
#include "../headers/LinearFunction.h"
#include "../headers/QuadraticFunction.h"

int main()
{
    srand((unsigned)time(NULL));

    size_t number_of_linear, number_of_quadratic;

    std::cout << "Enter the number of linear fuctions (n): ";
    do
    {
        std::cin >> number_of_linear;
    } while (number_of_linear < 0);

    std::cout << "Enter the number of quadratic fuctions (m): ";
    do
    {
        std::cin >> number_of_quadratic;
    } while (number_of_quadratic < 0);

    // Get point to evaluate function
    double point;
    std::cout << "Enter a point to evaluate functions: ";
    std::cin >> point;

    // Create an array of n linear functions
    vector<LinearFunction> linear_function;
    for (size_t i = 0; i < number_of_linear; i++)
        linear_function.push_back(LinearFunction());

    // Create an array of m quadratic functions
    vector<QuadraticFunction> quadratic_function;
    for (size_t i = 0; i < number_of_quadratic; i++)
        quadratic_function.push_back(QuadraticFunction());

    double current_max_value = linear_function[0].getEvaluatedValue();
    TFunction max_value_fn;

    std::cout << "\nLinear functions:\n--------------------\n";
    for (auto &func : linear_function)
    {
        // Evaluate function at random point value
        func.evaluatePoint(point);

        std::cout << func << ",\t";
        func.showEvaluatedValue();
    }

    std::cout << "\nQuadratic functions:\n--------------------\n";
    for (auto &func : quadratic_function)
    {
        // Evaluate function at random point value
        func.evaluatePoint(point);

        std::cout << func << ",\t";
        func.showEvaluatedValue();
    }

    std::cout << "\n[Increasing linear coefficients & decreasing quadratic ones]\n";

    std::cout << "\nLinear functions:\n--------------------\n";
    for (auto &func : linear_function)
    {
        // Increase linear function's coefficients by 3
        func.increaseCoefficients(3);

        // Evaluate function at random point value
        func.evaluatePoint(point);

        if (func.getEvaluatedValue() > current_max_value)
        {
            current_max_value = func.getEvaluatedValue();
            max_value_fn = func;
        }

        std::cout << func << ",\t";
        func.showEvaluatedValue();
    }

    std::cout << "\nQuadratic functions:\n--------------------\n";
    for (auto &func : quadratic_function)
    {
        // Decrease quadratic function's coefficients by 2
        func.decreaseCoefficients(2);

        // Evaluate function at random point value
        func.evaluatePoint(point);

        if (func.getEvaluatedValue() > current_max_value)
        {
            current_max_value = func.getEvaluatedValue();
            max_value_fn = func;
        }

        std::cout << func << ",\t";
        func.showEvaluatedValue();
    }

    std::cout << "\nFunction " << max_value_fn << " has maximum value of " << current_max_value << "\n";

    return 0;
}