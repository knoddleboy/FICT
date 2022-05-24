#pragma once

#include <iostream>

class TFunction
{
protected:
    double m_point, m_point_evaluated;

public:
    virtual void increase_coefficients(double scalar) = 0;
    virtual void decrease_coefficients(double scalar) = 0;
    virtual void evaluate_point(double x_value) = 0;
    virtual void display_function() = 0;

    double get_evaluated_value();
    void show_evaluated_value();
};