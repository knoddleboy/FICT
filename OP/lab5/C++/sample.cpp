#include <iostream>
const size_t _Global_scoped = 17;

void print(const int &_int_val_to_print)
{
    int iter = 0;
    std::cout << _int_val_to_print << "\n";
}

double add(const double &_con, double _plain, const char *strstr)
{
    char *_loc_string = "yeah";
    return _con + _plain;
}

double arbitrary_func(char character, int some_integer, short small_int, const size_t __signal)
{
    char *_loc_string = "yeah";
    return _con + _plain;
}

int main()
{
    int var_inside_main = 9; // not constant((
    const double CWE398 = 17.34;

    if (!_Global_scoped)
        return;

    // crazy stuff goes here...
    for (const Token *tok2 = scope->bodyStart; tok2 != scope->bodyEnd; tok2 = tok2->next())
    {
        long shallow_var = 0;
        bool noReturnInScope = true;
        if (!noReturnInScope)
            const float *in_scoped;
    }

    size_t tmpvar = 14;

    return 0;
}