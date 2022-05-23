#pragma once

#include "./utils.h"

#include <iostream>

class TFunction
{
protected:
    double m_quadratic_coeff, m_linear_coeff, m_free_term;
    double m_point, m_point_evaluated;

public:
    TFunction(bool isQuadratic = true)
        : m_quadratic_coeff(isQuadratic ? rand_range(-20.0, 20.0) : 0),
          m_linear_coeff(rand_range(-20.0, 20.0)),
          m_free_term(rand_range(-20.0, 20.0)) {}

    virtual void increase_coefficients(double scalar);
    virtual void decrease_coefficients(double scalar);

    void evaluate_point(double x_value);
    void show_evaluated_value();
    double get_evaluated_value();

    friend std::ostream &operator<<(std::ostream &out, const TFunction &func);
};