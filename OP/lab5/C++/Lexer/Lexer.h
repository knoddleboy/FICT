#pragma once

#include <vector>
#include <string>

using std::string;
using std::vector;

class Lexer
{
private:
    struct IdentifierNode
    {
        string identifier_name;
        struct IdentifierNode *left, *right; /* Plain variable goes to left, constant - to right */
    };

    IdentifierNode *empty(IdentifierNode *node);
    IdentifierNode *insert(IdentifierNode *_root, string _identifier_name, bool _is_plain_var);

    void printBT(const string &prefix, const IdentifierNode *node);

    IdentifierNode *m_root = nullptr;

public:
    Lexer() { m_root = create_new_node("[ROOT]"); };
    ~Lexer() { m_root = empty(m_root); };

    IdentifierNode *create_new_node(string _value);
    void insert(string _identifier_name, bool _is_plain_var);

    vector<string> split(string &_str, const char *_delimiter);
    bool is_data_type(string _str);
    void erase_identifier_prefix_postfix(string &_str);
    void printBT();
};