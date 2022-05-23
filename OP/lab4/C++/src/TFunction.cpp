#include "../headers/TFunction.h"

#include <iostream>
#include <iomanip>

/**
 * @brief Increase all function coefficients by `scalar`.
 */
void TFunction::increase_coefficients(double scalar)
{
    m_quadratic_coeff += scalar;
    m_linear_coeff += scalar;
    m_free_term += scalar;
}

/**
 * @brief Decrease all function coefficients by `scalar`.
 */
void TFunction::decrease_coefficients(double scalar)
{
    m_quadratic_coeff -= scalar;
    m_linear_coeff -= scalar;
    m_free_term -= scalar;
}

/**
 * @brief Evaluate function in `x_value` point.
 */
void TFunction::evaluate_point(double x_value)
{
    double evaluated_value = m_quadratic_coeff * (x_value * x_value) + m_linear_coeff * x_value + m_free_term;

    // Store point to show in the future
    m_point = x_value;

    // Store evaluated value
    m_point_evaluated = evaluated_value;
}

/**
 * @brief Display evaluated value in form: f(x0) = a.
 */
void TFunction::show_evaluated_value()
{
    std::cout << "f(" << m_point << ") = " << m_point_evaluated << "\n";
}

std::ostream &operator<<(std::ostream &out, const TFunction &func)
{
    out << std::setprecision(3) << "f(x) = ";

    if (func.m_quadratic_coeff)
    {
        out << func.m_quadratic_coeff << "x^2" << std::showpos << func.m_linear_coeff << "x" << func.m_free_term << std::noshowpos;
        return out;
    }
    out << func.m_linear_coeff << "x" << std::showpos << func.m_free_term << std::noshowpos;
    return out;
}

/**
 * @brief Getter: gets evaluated value, number.
 */
double TFunction::get_evaluated_value()
{
    return m_point_evaluated;
}