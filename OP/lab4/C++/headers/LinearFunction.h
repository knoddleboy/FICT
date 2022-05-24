#pragma once

#include "./TFunction.h"
#include "./utils.h"

class LinearFunction : public TFunction
{
private:
    double m_linear_coeff, m_free_term;

public:
    LinearFunction()
        : TFunction(),
          m_linear_coeff(rand_range(-20.0, 20.0)),
          m_free_term(rand_range(-20.0, 20.0)) {}

    void increase_coefficients(double) override;
    void decrease_coefficients(double) override;
    void evaluate_point(double) override;
    void display_function() override;

    friend std::ostream &operator<<(std::ostream &out, const LinearFunction &func);
};