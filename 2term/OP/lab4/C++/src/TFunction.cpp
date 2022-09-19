#include "../headers/TFunction.h"

/**
 * @brief Display evaluated value in form: f(x0) = a.
 */
void TFunction::show_evaluated_value()
{
    std::cout << "f(" << m_point << ") = " << m_point_evaluated << "\n";
}

/**
 * @brief Getter: gets evaluated value, number.
 */
double TFunction::get_evaluated_value()
{
    return m_point_evaluated;
}