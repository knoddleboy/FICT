#include "../headers/LinearFunction.h"

void LinearFunction::increaseCoefficients(double scalar)
{
    m_linear_coeff += scalar;
    m_free_term += scalar;
}

void LinearFunction::decreaseCoefficients(double scalar)
{
    m_linear_coeff -= scalar;
    m_free_term -= scalar;
}