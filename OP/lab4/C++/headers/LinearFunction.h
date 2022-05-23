#pragma once

#include "./TFunction.h"

class LinearFunction : public TFunction
{
public:
    LinearFunction() : TFunction(false) {}

    // Redefine methods since we do not need to change quadratic coefficient in a linear function
    void increaseCoefficients(double) override;
    void decreaseCoefficients(double) override;
};