from Functions import generate_linears, generate_quadratics


if __name__ == "__main__":
    n = int(input("Enter the number of linear functions (n): "))
    m = int(input("Enter the number of quadratic functions (m): "))
    point = float(input("Enter a point to evaluate functions: "))

    linear_function = generate_linears(n)
    quadratic_function = generate_quadratics(m)

    current_max_value, max_value_fn = None, None

    print("\nLinear functions:\n--------------------")
    for fn in linear_function:
        # Evaluate function at random point value
        fn.evaluate_point(point)

        print(f"{fn},\t{fn.show_evaluated_value}")

    print("\nQuadratic functions:\n--------------------")
    for fn in quadratic_function:
        # Evaluate function at random point value
        fn.evaluate_point(point)

        print(f"{fn},\t{fn.show_evaluated_value}")

    print("\n[Increasing linear coefficients & decreasing quadratic ones]")

    print("\nLinear functions:\n--------------------")
    for fn in linear_function:
        # Increase linear function's coefficients by 3
        fn.increase_coefficients(3)

        # Evaluate function at random point value
        fn.evaluate_point(point)

        if current_max_value and fn.get_evaluated_value > current_max_value:
            current_max_value = fn.get_evaluated_value
            max_value_fn = fn
        else:
            # If the current_max_value is unset for the moment
            current_max_value = fn.get_evaluated_value
            max_value_fn = fn

        print(f"{fn},\t{fn.show_evaluated_value}")

    print("\nQuadratic functions:\n--------------------")
    for fn in quadratic_function:
        # Decrease quadratic function's coefficients by 2
        fn.decrease_coefficients(2)

        # Evaluate function at random point value
        fn.evaluate_point(point)

        if current_max_value and fn.get_evaluated_value > current_max_value:
            current_max_value = fn.get_evaluated_value
            max_value_fn = fn
        else:
            # If the current_max_value is unset for the moment
            current_max_value = fn.get_evaluated_value
            max_value_fn = fn

        print(f"{fn},\t{fn.show_evaluated_value}")

    print(f"\nFunction {max_value_fn} has maximum value of {current_max_value:.2f}")
