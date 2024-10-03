from LinearFunction import LinearFunction
from QuadraticFunction import QuadraticFunction

import typing


def generate_linears(number: int) -> typing.List[LinearFunction]:
    linears = []

    for i in range(number):
        linears.append(LinearFunction())

    return linears


def generate_quadratics(number: int) -> typing.List[QuadraticFunction]:
    quadratics = []

    for i in range(number):
        quadratics.append(QuadraticFunction())

    return quadratics
