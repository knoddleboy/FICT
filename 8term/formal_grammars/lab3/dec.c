#include <stdbool.h>
#include <stdio.h>

// State machine states
typedef enum { S, A, B, C, D, E, F, G, H, I } States;

// Validate and parse a decimal signed floating-point number from a string
bool val_dec_num(const char *str, double *value) {
    int position = 0;
    short sign = 1;
    *value = 0;
    double frac = 0.1;
    States state = S;

    while (state != F && state != E && str[position] != '\0') {
        char symbol = str[position]; // current character being analyzed

        switch (state) {
        // Start state
        case S:
            if (symbol == '-') {
                state = A;
                sign = -1;
            } else if (symbol == '+') {
                state = A;
            } else if (symbol == '0') {
                state = B;
            } else if (symbol >= '1' && symbol <= '9') {
                state = C;
                *value = *value * 10.0 + (symbol - '0');
            } else {
                state = E;
                printf("Error: Expected a sign or digit at position %d\n",
                       position);
            }
            break;
        // Sign process state
        case A:
            if (symbol == '0') {
                state = G;
            } else if (symbol >= '1' && symbol <= '9') {
                state = C;
                *value = *value * 10 + (symbol - '0');
            } else {
                state = E;
                printf(
                    "Error: Invalid character in integer part at position %d\n",
                    position);
            }
            break;
        // Zero state
        case B:
            if (symbol == '.') {
                state = D;
            } else if (symbol == ';') {
                state = F;
            } else {
                state = E;
                printf("Error: Expected '.' or ';' at position %d\n", position);
            }
            break;
        // Integer part state
        case C:
            if (symbol >= '0' && symbol <= '9') {
                state = H;
                *value = *value * 10 + (symbol - '0');
            } else if (symbol == '.') {
                state = D;
            } else {
                state = E;
                printf("Error: Expected digit or '.' at position %d\n",
                       position);
            }
            break;
        // Decimal point state
        case D:
            if (symbol >= '0' && symbol <= '9') {
                state = I;
                *value += frac * (symbol - '0');
                frac /= 10;
            } else {
                state = E;
                printf("Error: Expected digit after '.' at position %d\n",
                       position);
            }
            break;
        // Zero after sign state
        case G:
            if (symbol == '.') {
                state = D;
            } else {
                state = E;
                printf("Error: Expected '.' after zero at position %d\n",
                       position);
            }
            break;
        // Continued integer part state
        case H:
            if (symbol >= '0' && symbol <= '9') {
                state = H;
                *value = *value * 10 + (symbol - '0');
            } else if (symbol == '.') {
                state = D;
            } else {
                state = E;
                printf("Error: Expected digit or '.' at position %d\n",
                       position);
            }
            break;
        // Fractional part state
        case I:
            if (symbol >= '0' && symbol <= '9') {
                state = I;
                *value += frac * (symbol - '0');
                frac /= 10;
            } else if (symbol == ';') {
                state = F;
            } else {
                state = E;
                printf("Error: Unexpected character in fractional part at "
                       "position %d\n",
                       position);
            }
            break;
        default:
            state = E;
            printf("Error: Undefined state at position %d\n", position);
            break;
        }
        position++;
    }
    *value *= sign;
    return state ==
           F; // is in accepting state, indicating end of validation or error
}

int main() {
    const char *test_str = "0.1;";
    double value;

    if (val_dec_num(test_str, &value)) {
        printf("Valid number: %lf\n", value);
    }

    return 0;
}
