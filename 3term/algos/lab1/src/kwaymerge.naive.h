#ifndef KWAYMERGENAIVE_H
#define KWAYMERGENAIVE_H

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <libgen.h> // for basename()
#include <chrono>   // for time measure

using namespace std;

using std::chrono::duration;
using std::chrono::duration_cast;
using std::chrono::high_resolution_clock;
using std::chrono::milliseconds;
using std::chrono::seconds;

double smart_time_output(
    const high_resolution_clock::time_point time_start,
    const high_resolution_clock::time_point time_end);
string stl_basename(const string &filename);

template <class T>
class MERGE_RUN_UNIT
{
public:
    T data;
    istream *stream;
    bool (*compare_function)(const T &x, const T &y);

    MERGE_RUN_UNIT(const T &data,
                   istream *stream,
                   bool (*compare_function)(const T &x, const T &y))
        : data(data),
          stream(stream),
          compare_function(compare_function)
    {
    }

    bool operator<(const MERGE_RUN_UNIT &m) const
    {
        // Since priority queue sorts in descending order, we need to negate
        return !(compare_function(data, m.data));
    }
};

template <class T>
class KwayMergeSort
{

public:
    KwayMergeSort(
        const string &input_file,
        ostream *out_stream,
        bool (*compare_function)(const T &x, const T &y) = nullptr,
        size_t max_buffer_size = 1000000,
        string temp_file = "./temp");

    KwayMergeSort(
        const string &input_file,
        ostream *out_stream,
        size_t max_buffer_size = 1000000,
        string temp_file = "./temp");

    ~KwayMergeSort(void);

    void Sort();

private:
    // Constructor originated values
    string _input_file;
    ostream *_out_stream;
    bool (*_compare_function)(const T &x, const T &y);
    size_t _max_buffer_size;
    string _temp_file;

    bool _temp_file_used;
    size_t _which_run;

    vector<string> _v_temp_file_names; // contains temp file names
    vector<ifstream *> _v_temp_files;  // contains pointers on opened temp files' streams

    // Drives the creation of sorted sub-files stored on disk
    void DivideAndSort();

    // Drives the merging of the sorted temp files.
    // Eventually sorted and merged output is written to `out_stream`
    void Merge();

    // Writes sorted chunk of data to a temp file
    void WriteTempFile(const vector<T> &lines);

    // Open and close temp files
    void OpenTempFiles();
    void CloseTempFiles();
};

// Constructor
template <class T>
KwayMergeSort<T>::KwayMergeSort(const string &input_file,
                                ostream *out_stream,
                                bool (*compare_function)(const T &x, const T &y),
                                size_t max_buffer_size,
                                string temp_file)
    : _input_file(input_file),
      _out_stream(out_stream),
      _compare_function(compare_function),
      _max_buffer_size(max_buffer_size),
      _temp_file(temp_file),
      _which_run(0)
{
}

// Constructor without compare function
template <class T>
KwayMergeSort<T>::KwayMergeSort(const string &input_file,
                                ostream *out_stream,
                                size_t max_buffer_size,
                                string temp_file)
    : _input_file(input_file),
      _out_stream(out_stream),
      _compare_function(nullptr),
      _max_buffer_size(max_buffer_size),
      _temp_file(temp_file),
      _which_run(0)
{
}

// Destructor
template <class T>
KwayMergeSort<T>::~KwayMergeSort(void)
{
}

// Sorting API
template <class T>
void KwayMergeSort<T>::Sort()
{
    double t_das, t_mrg;
    auto t1 = high_resolution_clock::now();
    DivideAndSort();
    auto t2 = high_resolution_clock::now();

    cout << "DivideAndSort() \t--- ";
    t_das = smart_time_output(t1, t2);
    cout << "    :- "
         << _which_run
         << " temp"
         << ((_which_run % 10 == 1) ? " " : "s ")
         << "created.\n\n";

    t1 = high_resolution_clock::now();
    Merge();
    t2 = high_resolution_clock::now();

    cout << "Merge() \t\t--- ";
    t_mrg = smart_time_output(t1, t2);
    cout << "    :- \n\n";

    cout << "Total time \t\t--- " << t_das + t_mrg << " s" << endl;
}

template <class T>
void KwayMergeSort<T>::DivideAndSort()
{
    istream *input = new ifstream(_input_file.c_str(), ios::in);

    // Exit if file opened with error (or did not open)
    if (input->good() == false)
    {
        cerr << "Error: Could not open input file (" << _input_file << "). Exiting." << endl;
        exit(1);
    }

    vector<T> line_buffer;
    line_buffer.reserve(100000);

    size_t total_bytes = 0; // for tracking the number of consumed bytes

    // Whether or not we used a temp file based on the allocated memory
    _temp_file_used = false;

    // Read from file line by line until there is no more data
    T line;
    while (*input >> line)
    {
        line_buffer.push_back(line);
        total_bytes += sizeof(line);

        // Sort the buffer and write to a temp file when we have filled up our quota
        if (total_bytes > _max_buffer_size)
        {
            if (_compare_function != nullptr)
                sort(line_buffer.begin(), line_buffer.end(), *_compare_function);
            else
                sort(line_buffer.begin(), line_buffer.end());

            // Write the sorted data to a temp file
            WriteTempFile(line_buffer);

            // and clear the buffer for the next run
            line_buffer.clear();

            _temp_file_used = true;
            total_bytes = 0;
        }
    }

    // Handle the run (if any) from the last chunk of the input data
    if (line_buffer.empty() == false)
    {
        // Write the last chunk to the temp file
        // if one had to be used (i.e., we exceeded the memory)
        if (_temp_file_used == true)
        {
            if (_compare_function != nullptr)
                sort(line_buffer.begin(), line_buffer.end(), *_compare_function);
            else
                sort(line_buffer.begin(), line_buffer.end());

            // Write the sorted data to a temp file
            WriteTempFile(line_buffer);
            WriteTempFile(line_buffer);
        }

        // otherwise, the entire file fit in the given memory,
        // so we can just dump to the output
        else
        {
            if (_compare_function != nullptr)
                sort(line_buffer.begin(), line_buffer.end(), *_compare_function);
            else
                sort(line_buffer.begin(), line_buffer.end());

            for (size_t i = 0; i < line_buffer.size(); ++i)
                *_out_stream << line_buffer[i] << endl;
        }
    }
}

template <class T>
void KwayMergeSort<T>::WriteTempFile(const vector<T> &lines)
{
    string temp_file_name;
    if (_temp_file.size() == 0)
        temp_file_name = _input_file + "." + to_string(_which_run);
    else
        temp_file_name = _temp_file + "/" + stl_basename(_input_file) + "." + to_string(_which_run);

    ofstream *output = new ofstream(temp_file_name.c_str(), ios::out);

    // Write the content of the current buffer to the temp file
    for (size_t i = 0; i < lines.size(); ++i)
        *output << lines[i] << endl;

    // Update run counter and add the temp file name to the list
    ++_which_run;
    output->close();
    delete output;
    _v_temp_file_names.push_back(temp_file_name);
}

template <class T>
void KwayMergeSort<T>::Merge()
{
    // The merge part can be skipped if previously the entire input file fit
    // in memory and thus we just dumped to `out_stream` without temp files
    if (_temp_file_used == false)
        return;

    // Open the sorted temp files up for merging
    OpenTempFiles();

    priority_queue<MERGE_RUN_UNIT<T>> out_queue;

    T line;
    for (size_t i = 0; i < _v_temp_files.size(); ++i)
    {
        *_v_temp_files[i] >> line;
        out_queue.push(MERGE_RUN_UNIT<T>(line, _v_temp_files[i], _compare_function));
    }

    while (!out_queue.empty())
    {
        // Grab the lowest (first) element
        MERGE_RUN_UNIT<T> lowest = out_queue.top();

        // output it to the stream (output file)
        *_out_stream << lowest.data << endl;

        // and remove from queue
        out_queue.pop();

        // Push the next line from the lowest stream to the queue unless it's EOF
        *(lowest.stream) >> line;
        if (*(lowest.stream))
            out_queue.push(MERGE_RUN_UNIT<T>(line, lowest.stream, _compare_function));
    }

    // Clean up the temp files
    CloseTempFiles();
}

template <class T>
void KwayMergeSort<T>::OpenTempFiles()
{
    // Go through each temp file name and open its stream
    for (size_t i = 0; i < _v_temp_file_names.size(); ++i)
    {
        ifstream *file = new ifstream(_v_temp_file_names[i].c_str(), ios::in);

        // Save file stream if opened
        if (file->good())
            _v_temp_files.push_back(file);

        // Threw an error otherwise
        else
        {
            cerr << "Unable to open temp file ("
                 << _v_temp_file_names[i]
                 << "). The file might not exist. Exiting."
                 << endl;
            exit(1);
        }
    }
}

template <class T>
void KwayMergeSort<T>::CloseTempFiles()
{
    // Close all temp files
    for (size_t i = 0; i < _v_temp_files.size(); ++i)
    {
        _v_temp_files[i]->close();
        delete _v_temp_files[i];
    }

    // and delete them
    for (size_t i = 0; i < _v_temp_file_names.size(); ++i)
        remove(_v_temp_file_names[i].c_str());
}

double smart_time_output(
    const high_resolution_clock::time_point time_start,
    const high_resolution_clock::time_point time_end)
{
    duration<double> seconds = time_end - time_start;
    duration<double, std::milli> ms_double = seconds;

    if (ms_double.count() < 1000)
        cout << ms_double.count() << " ms" << endl;
    else
        cout << seconds.count() << " s" << endl;

    return seconds.count();
}

string stl_basename(const string &path)
{
    string result;

    char *path_dup = strdup(path.c_str());
    char *basename_part = basename(path_dup);
    result = basename_part;
    free(path_dup);

    size_t pos = result.find_last_of('.');
    if (pos != string::npos)
        result = result.substr(0, pos);

    return result;
}

#endif /* KWAYMERGENAIVE_H */