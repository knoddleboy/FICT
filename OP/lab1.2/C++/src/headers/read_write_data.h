#pragma once

/* ------------------------------------------------------------------------- */
/*                       Write from struct into stream                       */
/* ------------------------------------------------------------------------- */

template <typename stream_T, typename T>
void write_from_field(stream_T &out, T const &field)
{
    // Write string length before writing an actual string
    size_t length = field.size();
    out.write(reinterpret_cast<char const *>(&length), sizeof(length));
    out.write(field.c_str(), length);
}

/**
 * @brief Writes string-data into the `out` stream from structs' fields, provided in `fields`.
 *
 * @param out output stream object reference
 * @param fields origin structs' fields to be read
 */
template <typename stream_T, typename... Fields>
stream_T &write(stream_T &out, Fields const &...fields)
{
    (write_from_field(out, fields), ...); // c++ 17 variadic templates unpacking
    return out;
}

/* ------------------------------------------------------------------------- */
/*                       Read from stream into struct                        */
/* ------------------------------------------------------------------------- */

template <typename stream_T, typename T>
void read_into_field(stream_T &in, T &field)
{
    // Contains following string's length to create a buffer of the appropriate size
    size_t length = 0;
    in.read(reinterpret_cast<char *>(&length), sizeof(length));

    // Buffer to store a string of the length `length`, read from the stream
    char *buffer = new char[length + 1];
    in.read(buffer, length);
    buffer[length] = '\0';

    // Save the buffer into a struct field's reference
    field = buffer;

    delete[] buffer;
}

/**
 * @brief Reads string-data from the in stream into structs' fields, provided in fields.
 *
 * @param in input stream object reference
 * @param fields destination structs' fields to be written
 */
template <typename stream_T, typename... Fields>
stream_T &read(stream_T &in, Fields &...fields)
{
    (read_into_field(in, fields), ...); // c++ 17 variadic templates unpacking
    return in;
}