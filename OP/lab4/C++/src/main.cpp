/**
 * @file main.cpp
 * @author Knysh Dmytro, IP-11
 *
 * @brief Fundamentals of Programming - Lab #4, var 15

 * @date 24.05.2022
 */

#include <iostream>
#include <ctime>
#include <vector>

using std::vector;

#include "../headers/TFunction.h"
#include "../headers/LinearFunction.h"
#include "../headers/QuadraticFunction.h"

// union Variant_fn
// {
//     LinearFunction l;
//     QuadraticFunction q;
// };

typedef enum
{
    LINEAR,
    QUADRATIC
} Flag;

// Here we store the function, whose value in point is the highest
typedef struct
{
    // Flag to indicate curent union's value
    Flag flag;

    union
    {
        LinearFunction l;
        QuadraticFunction q;
    } u_fn;

} Variant_fn;

int main()
{
    srand((unsigned)time(NULL));

    size_t number_of_linear, number_of_quadratic;

    std::cout << "Enter the number of linear functions (n): ";
    do
    {
        std::cin >> number_of_linear;
    } while (number_of_linear < 0);

    std::cout << "Enter the number of quadratic functions (m): ";
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

    double current_max_value = linear_function[0].get_evaluated_value();
    Variant_fn max_value_fn = {};

    std::cout << "\nLinear functions:\n--------------------\n";
    for (auto &func : linear_function)
    {
        // Evaluate function at random point value
        func.evaluate_point(point);

        std::cout << func << "\n";
    }

    std::cout << "\nQuadratic functions:\n--------------------\n";
    for (auto &func : quadratic_function)
    {
        // Evaluate function at random point value
        func.evaluate_point(point);

        std::cout << func << "\n";
    }

    std::cout << "\nIncreasing linear coefficients & decreasing quadratic ones:\n";

    std::cout << "\nLinear functions:\n--------------------\n";
    for (auto &func : linear_function)
    {
        // Increase linear function's coefficients by 3
        func.increase_coefficients(3);

        // Evaluate function at random point value
        func.evaluate_point(point);

        if (func.get_evaluated_value() > current_max_value)
        {
            current_max_value = func.get_evaluated_value();
            max_value_fn.u_fn.l = func;
            max_value_fn.flag = LINEAR;
        }

        std::cout << func << ",\t";
        func.show_evaluated_value();
    }

    std::cout << "\nQuadratic functions:\n--------------------\n";
    for (auto &func : quadratic_function)
    {
        // Decrease quadratic function's coefficients by 2
        func.decrease_coefficients(2);

        // Evaluate function at random point value
        func.evaluate_point(point);

        if (func.get_evaluated_value() > current_max_value)
        {
            current_max_value = func.get_evaluated_value();
            max_value_fn.u_fn.q = func;
            max_value_fn.flag = QUADRATIC;
        }

        std::cout << func << ",\t";
        func.show_evaluated_value();
    }

    // std::cout << "\nFunction " << max_value_fn.l << max_value_fn.q << " has maximum value of " << current_max_value << "\n";
    std::cout << "\nFunction ";

    if (max_value_fn.flag == LINEAR)
        std::cout << max_value_fn.u_fn.l;
    else
        std::cout << max_value_fn.u_fn.q;

    std::cout << " has maximum value of " << current_max_value << "\n";

    return 0;
}