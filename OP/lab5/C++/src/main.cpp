#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <ctype.h>

#include "../Lexer/Lexer.h"

using std::string;
using std::vector;

int main(int argc, char *argv[])
{
    string file_path;

    if (argc == 1)
    {
        std::cout << "Enter the file path: ";
        std::cin >> file_path;
    }
    else
        file_path = argv[1];

    std::ifstream file(file_path);

    if (!file.is_open())
    {
        std::cerr << "Invalid file path: " << file_path << "\nPlease verify the correct path was given.\n";
        exit(1);
    }

    Lexer root_lexer;

    string line;
    size_t line_number = 0;
    while (std::getline(file, line))
    {
        ++line_number;
        vector<string> tokens = root_lexer.split(line, " ");
        vector<string> extracted_const_identifiers;
        vector<string> extracted_variable_identifiers;

        size_t total_identifiers_per_line = 0;
        size_t token_index = -1;
        for (auto &tok : tokens)
        {
            ++token_index;

            if (tok == "const" || tok.find("(const") != string::npos)
            {
                //  const int a = 4;
                //  ^^^^^     ^
                string const_identifier = tokens[token_index + 2];
                root_lexer.erase_identifier_prefix_postfix(const_identifier);

                //  const char *const b = "123"
                //              ^^^^^ ^
                if (const_identifier == "const")
                    const_identifier = tokens[token_index + 3];

                root_lexer.erase_identifier_prefix_postfix(const_identifier);

                // Store extracted identifier
                extracted_const_identifiers.push_back(const_identifier);
                ++total_identifiers_per_line;
            }

            // Except when first token is data type since it is function return type
            if (root_lexer.is_data_type(tok))
            {
                //  int function(int a, float b)
                //  ^^^         ^
                if (token_index == 0 && tokens[1].find("(") != string::npos)
                    continue;

                if (tokens[token_index - 1].find("const") != string::npos)
                    continue;

                //  bool c = false
                //  ^^^^ ^
                string variable_identifier = tokens[token_index + 1];
                root_lexer.erase_identifier_prefix_postfix(variable_identifier);

                //  double const d = 9.1
                //         ^^^^^ ^
                if (variable_identifier == "const")
                    variable_identifier = tokens[token_index + 2];

                root_lexer.erase_identifier_prefix_postfix(variable_identifier);

                // Store extracted identifier
                extracted_variable_identifiers.push_back(variable_identifier);
                ++total_identifiers_per_line;
            }
        }

        string out_var_names = std::to_string(line_number) + ": ";
        string out_const_names = std::to_string(line_number) + ": ";

        for (auto &var : extracted_variable_identifiers)
            out_var_names += "{ " + var + " } ";

        for (auto &var : extracted_const_identifiers)
            out_const_names += "{ " + var + " } ";

        if (!extracted_variable_identifiers.empty()) // If we have some variables, merge them into the
        {                                            // one string and display that string in a node.
            out_var_names.pop_back();                // remove last space
            root_lexer.insert(out_var_names, true);
        }
        else // If on the current line there are no plain variables, create node with [NONE] value.
            root_lexer.insert(std::to_string(line_number) + ": [NONE]", true);

        if (!extracted_const_identifiers.empty()) // If we have some variables, merge them into the
        {                                         // one string and display that string in a node.
            out_const_names.pop_back();           // remove last space
            root_lexer.insert(out_const_names, false);
        }
        else // If on the current line there are no constants, create node with [NONE] value.
            root_lexer.insert(std::to_string(line_number) + ": [NONE]", false);
    }

    root_lexer.printBT();

    file.close();
    return 0;
}