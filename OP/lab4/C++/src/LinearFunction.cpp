#include "../headers/LinearFunction.h"

#include <iostream>
#include <iomanip>

void LinearFunction::increase_coefficients(double scalar)
{
    m_linear_coeff += scalar;
    m_free_term += scalar;
}

void LinearFunction::decrease_coefficients(double scalar)
{
    m_linear_coeff -= scalar;
    m_free_term -= scalar;
}

void LinearFunction::evaluate_point(double x_value)
{
    double evaluated_value = m_linear_coeff * x_value + m_free_term;

    // Store point to show in the future
    m_point = x_value;

    // Store evaluated value
    m_point_evaluated = evaluated_value;
}

void LinearFunction::display_function()
{
    std::cout << std::setprecision(3) << "f(x) = " << m_linear_coeff << "x" << std::showpos << m_free_term << std::noshowpos;
}

std::ostream &operator<<(std::ostream &out, const LinearFunction &func)
{
    out << std::setprecision(3) << "f(x) = " << func.m_linear_coeff << "x" << std::showpos << func.m_free_term << std::noshowpos;
    return out;
}