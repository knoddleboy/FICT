#include "../headers/QuadraticFunction.h"

#include <iostream>
#include <iomanip>

void QuadraticFunction::increase_coefficients(double scalar)
{
    m_quadratic_coeff += scalar;
    m_linear_coeff += scalar;
    m_free_term += scalar;
}

void QuadraticFunction::decrease_coefficients(double scalar)
{
    m_quadratic_coeff -= scalar;
    m_linear_coeff -= scalar;
    m_free_term -= scalar;
}

void QuadraticFunction::evaluate_point(double x_value)
{
    double evaluated_value = m_quadratic_coeff * (x_value * x_value) + m_linear_coeff * x_value + m_free_term;

    // Store point to show in the future
    m_point = x_value;

    // Store evaluated value
    m_point_evaluated = evaluated_value;
}

void QuadraticFunction::display_function()
{
    std::cout << std::setprecision(3) << "f(x) = " << m_quadratic_coeff << "x^2" << std::showpos << m_linear_coeff << "x" << m_free_term << std::noshowpos;
}

std::ostream &operator<<(std::ostream &out, const QuadraticFunction &func)
{
    out << std::setprecision(3) << "f(x) = " << func.m_quadratic_coeff << "x^2" << std::showpos << func.m_linear_coeff << "x" << func.m_free_term << std::noshowpos;
    return out;
}