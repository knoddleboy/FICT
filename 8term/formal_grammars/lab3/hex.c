#include <ctype.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>

// State machine states
typedef enum { S, A, B, C, D, E, F, G, H, I, J, K } States;

// Convert a hexadecimal digit to its numeric value
int hex2int(char ch) {
    if (ch >= '0' && ch <= '9')
        return ch - '0';
    else if (ch >= 'a' && ch <= 'f')
        return 10 + (ch - 'a');
    else if (ch >= 'A' && ch <= 'F')
        return 10 + (ch - 'A');
    return -1;
}

// Validate and parse a signed hexadecimal floating-point number from a string
bool val_hex_num(const char *str, double *value) {
    int position = 0;
    short sign = 1;
    *value = 0;
    double frac = 1.0 / 16.0;
    int exponent = 0;
    int exp_sign = 1;
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
            } else {
                state = E;
                printf("Error: Expected sign or '0' at position %d\n",
                       position);
            }
            break;
        case A:
            if (symbol == '0') {
                state = B;
            } else {
                state = E;
                printf("Error: Expected '0' after sign at position %d\n",
                       position);
            }
            break;
        case B:
            if (symbol == 'x' || symbol == 'X') {
                state = C;
            } else {
                state = E;
                printf("Error: Expected 'x' or 'X' at position %d\n", position);
            }
            break;
        // Integer part state
        case C:
            if (hex2int(symbol) >= 0) {
                state = D;
                *value = hex2int(symbol);
            } else {
                state = E;
                printf("Error: Expected a hexadecimal digit at position %d\n",
                       position);
            }
            break;
        // Continued integer part state
        case D:
            if (hex2int(symbol) >= 0) {
                *value = *value * 16 + hex2int(symbol);
            } else if (symbol == '.') {
                state = G;
            } else if (symbol == 'p' || symbol == 'P') {
                state = I;
            } else {
                state = E;
                printf("Error: Expected hex digit, '.' or 'p' at position %d\n",
                       position);
            }
            break;
        // Fractional part state
        case G:
            if (hex2int(symbol) >= 0) {
                state = H;
                *value += frac * hex2int(symbol);
                frac /= 16.0;
            } else {
                state = E;
                printf("Error: Expected hex digit after '.' at position %d\n",
                       position);
            }
            break;
        // Continued fractional part state
        case H:
            if (hex2int(symbol) >= 0) {
                *value += frac * hex2int(symbol);
                frac /= 16.0;
            } else if (symbol == 'p' || symbol == 'P') {
                state = I;
            } else {
                state = E;
                printf("Error: Expected hex digit or 'p' at position %d\n",
                       position);
            }
            break;
        // Exponential part state
        case I:
            if (symbol == '-') {
                exp_sign = -1;
                state = J;
            } else if (symbol == '+') {
                state = J;
            } else if (isdigit(symbol)) {
                state = K;
                exponent = exponent * 10 + (symbol - '0');
            } else {
                state = E;
                printf("Error: Expected sign or digit in exponent at position "
                       "%d\n",
                       position);
            }
            break;
        // Continued exponential part state
        case J:
            if (isdigit(symbol)) {
                state = K;
                exponent = exponent * 10 + (symbol - '0');
            } else {
                state = E;
                printf("Error: Expected digit after sign at position %d\n",
                       position);
            }
            break;
        case K:
            if (isdigit(symbol)) {
                exponent = exponent * 10 + (symbol - '0');
            } else if (symbol == ';') {
                state = F;
            } else {
                state = E;
                printf(
                    "Error: Unexpected character in exponent at position %d\n",
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

    if (state == F) {
        *value *= pow(2, exp_sign * exponent);
    }

    *value *= sign;
    return state == F;
}

int main() {
    const char *test_str = "0x1.15AE147AE147Bp+6;";
    double value;

    if (val_hex_num(test_str, &value)) {
        printf("Valid number: %lf\n", value);
    }

    return 0;
}
