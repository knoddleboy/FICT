#include "./Lexer.h"

#include <iostream>
#include <algorithm>

Lexer::IdentifierNode *Lexer::empty(IdentifierNode *node)
{
    if (node == nullptr)
        return nullptr;
    {
        empty(node->left);
        empty(node->right);
        delete node;
    }
    return nullptr;
}

Lexer::IdentifierNode *Lexer::insert(IdentifierNode *_root, string _identifier_name, bool _is_plain_var)
{
    if (_root == nullptr)
        return create_new_node(_identifier_name);

    if (_is_plain_var) // insert a plain var into the left subtree
        _root->left = insert(_root->left, _identifier_name, true);

    if (!_is_plain_var) // insert a constant var into the right subtree
        _root->right = insert(_root->right, _identifier_name, false);

    return _root; // Return the original root after insertion
}

void Lexer::printBT(const std::string &prefix, const IdentifierNode *node)
{
    if (node != nullptr)
    {
        std::cout << prefix << "'-";

        // print the value of the node
        std::cout << node->identifier_name << "\n";

        // enter the next tree level - left and right branch
        printBT(prefix + "  ", node->left);
        printBT(prefix + "  ", node->right);
    }
}

Lexer::IdentifierNode *Lexer::create_new_node(string _value)
{
    IdentifierNode *_new_node = new IdentifierNode;
    _new_node->identifier_name = _value;
    _new_node->left = nullptr;
    _new_node->right = nullptr;

    return _new_node;
}

void Lexer::insert(string _identifier_name, bool _is_plain_var)
{
    m_root = insert(m_root, _identifier_name, _is_plain_var);
}

vector<string> Lexer::split(string &_str, const char *_delimiter)
{
    vector<string> tokens;
    size_t pos = 0;

    while ((pos = _str.find(_delimiter)) != string::npos)
    {
        tokens.push_back(_str.substr(0, pos));
        _str.erase(0, pos + 1);
    }
    tokens.push_back(_str);

    return tokens;
}

bool Lexer::is_data_type(string _str)
{
    vector<string> data_types = {
        "auto", "int", "short", "long", "size_t",
        "float", "double", "char", "bool"};

    if (_str.find("(") != string::npos)
        _str.erase(0, _str.find("(") + 1);

    if (_str.back() == '*' || _str.back() == '&')
        _str.pop_back();

    return std::find(data_types.begin(), data_types.end(), _str) != data_types.end();
}

void Lexer::erase_identifier_prefix_postfix(string &_str)
{
    if (_str[0] == '*' || _str[0] == '&')
        _str.erase(0, 1);

    if (_str.back() == ';' || _str.back() == ',')
        _str.pop_back();

    if (_str.find(")") != string::npos)
        _str.erase(_str.find(")"), _str.length() - 1);

    if (_str.find("[") != string::npos)
        _str.erase(_str.find("["), _str.length() - 1);
}

void Lexer::printBT() { printBT("", m_root); }