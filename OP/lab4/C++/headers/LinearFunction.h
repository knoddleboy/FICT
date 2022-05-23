#pragma once

#include "./TFunction.h"

class LinearFunction : public TFunction
{
public:
    LinearFunction() : TFunction(false) {}

    // Override methods for linear function, since we do not need to manage quadratic coefficient
    void increase_coefficients(double) override;
    void decrease_coefficients(double) override;
};