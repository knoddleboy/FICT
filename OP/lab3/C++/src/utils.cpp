#include "../headers/Circle.h"

Circle &find_longest_circle(Circle &circle1, Circle &circle2, Circle &circle3)
{
    const double c1_circ = circle1.get_circumference(),
                 c2_circ = circle2.get_circumference(),
                 c3_circ = circle3.get_circumference();
    return (c1_circ > c2_circ && c1_circ > c3_circ)
               ? circle1
           : (c2_circ > c3_circ)
               ? circle2
               : circle3;
}