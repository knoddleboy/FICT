#ifndef KWAYMERGESORT_H
#define KWAYMERGESORT_H

#include <iostream>
#include <iomanip>
#include <cstdio>
#include <sys/mman.h> // mmap()
#include <sys/stat.h> // file size
#include <unistd.h>   // ftruncate()
#include <vector>
#include <string>
#include <algorithm>
#include <queue>
#include <libgen.h> // basename()
#include <chrono>   // time measure

using namespace std;
using std::chrono::duration;
using std::chrono::duration_cast;
using std::chrono::high_resolution_clock;
using std::chrono::milliseconds;
using std::chrono::seconds;

#define fixed_float(x) fixed << setprecision(4) << (x) << defaultfloat

double smart_time_output(
    const high_resolution_clock::time_point &time_start,
    const high_resolution_clock::time_point &time_end);
string stl_basename(const string &filename);

template <class T>
class Merge_Run_Unit
{
public:
    T data;
    FILE *f;
    bool (*compare_function)(const T &x, const T &y);

    Merge_Run_Unit(const T &data,
                   FILE *f,
                   bool (*compare_function)(const T &x, const T &y))
        : data(data),
          f(f),
          compare_function(compare_function)
    {
    }

    bool operator<(const Merge_Run_Unit &m) const
    {
        // Since priority queue sorts in descending order, we need to negate
        return !(compare_function(data, m.data));
    }
};

template <class T>
class Temp
{
public:
    string name;
    FILE *stream;
    off_t size;
    T *map;

    Temp(const string &__tf_name)
        : name(__tf_name)
    {
    }
};

template <class T>
class KwayMergeSort
{

public:
    KwayMergeSort(
        const string &input_file,
        const string &_output_file,
        T max_buffer_size,
        bool (*compare_function)(const T &x, const T &y) = nullptr,
        string temp_file = "./temp");

    KwayMergeSort(
        const string &input_file,
        const string &_output_file,
        T max_buffer_size,
        string temp_file = "./temp");

    ~KwayMergeSort(void);

    void Sort();

private:
    // Constructor originated values
    string _input_file;
    string _output_file;
    bool (*_compare_function)(const T &x, const T &y);
    T _max_buffer_size;
    string _temp_file;

    bool _sorted_internally;
    size_t _which_run;

    vector<Temp<T>> _v_temps;

    // Drives the creation of sorted sub-files stored on disk
    void DistributeAndSort();

    // Drives the merging of the sorted temp files.
    // Eventually sorted and merged output is written to `out_stream`
    void Merge();

    // Writes sorted chunk of data to a temp file
    void WriteTempFile(const T *buffer_p, const T bytes);

    // Open and close temp files
    void OpenTempFiles();
    void CloseTempFiles();
};

// Constructor
template <class T>
KwayMergeSort<T>::KwayMergeSort(const string &input_file,
                                const string &output_file,
                                T max_buffer_size,
                                bool (*compare_function)(const T &x, const T &y),
                                string temp_file)
    : _input_file(input_file),
      _output_file(output_file),
      _max_buffer_size(max_buffer_size),
      _compare_function(compare_function),
      _temp_file(temp_file),
      _sorted_internally(false),
      _which_run(0)
{
}

// Constructor without compare function
template <class T>
KwayMergeSort<T>::KwayMergeSort(const string &input_file,
                                const string &output_file,
                                T max_buffer_size,
                                string temp_file)
    : _input_file(input_file),
      _output_file(output_file),
      _compare_function(nullptr),
      _max_buffer_size(max_buffer_size),
      _temp_file(temp_file),
      _sorted_internally(false),
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
    DistributeAndSort();
    auto t2 = high_resolution_clock::now();

    printf("%-25s ", "Distribution");
    t_das = smart_time_output(t1, t2);

    t1 = high_resolution_clock::now();
    Merge();
    t2 = high_resolution_clock::now();

    printf("%-25s ", "Merge");
    double t_mrg = smart_time_output(t1, t2);

    printf("------\n%-25s %.3lfs\n", "Total", t_das + t_mrg);
}

template <class T>
void KwayMergeSort<T>::DistributeAndSort()
{
    FILE *f_in;
    if ((f_in = fopen(_input_file.c_str(), "rb")) == nullptr)
    {
        cerr << "Error: could not open input file " << _input_file << endl;
        exit(EXIT_FAILURE);
    }

    fseek(f_in, 0L, SEEK_END);
    auto f_in_size = ftell(f_in); // input file size
    fseek(f_in, 0L, SEEK_SET);

    T buffer_size = _max_buffer_size / sizeof(T);
    T *buffer = new (nothrow) T[buffer_size];

    T bytes; // number of read bytes
    while ((bytes = fread(buffer, sizeof(T), buffer_size, f_in)) > 0)
    {
        if (_compare_function != nullptr)
            sort(buffer, buffer + bytes, *_compare_function);
        else
            sort(buffer, buffer + bytes);

        // If the buffer size is less that input file size (most probably), then distribute between temp files
        if (_max_buffer_size < f_in_size)
            WriteTempFile(buffer, bytes);

        // otherwise the entire file fit in memory, thus sorted in buffer and can be dumped to the output
        else
        {
            FILE *f_out;
            if ((f_out = fopen(_output_file.c_str(), "wb")) == nullptr)
            {
                cerr << "Error: could not open output file " << _output_file << endl;
                fclose(f_in);
                exit(EXIT_FAILURE);
            }

            fwrite(buffer, sizeof(T), bytes, f_out);
            fclose(f_out);

            _sorted_internally = true;
        }

        memset(buffer, 0, bytes);
    }

    fclose(f_in);
    delete[] buffer;
}

template <class T>
void KwayMergeSort<T>::WriteTempFile(const T *__pbuffer, const T __bytes)
{
    const T __bytes_size = __bytes * sizeof(T);

    string temp_file_name;
    if (_temp_file.size() == 0)
        temp_file_name = _input_file + "." + to_string(_which_run);
    else
        temp_file_name = _temp_file + "/" + stl_basename(_input_file) + "." + to_string(_which_run);

    FILE *tf_out = fopen(temp_file_name.c_str(), "wb+");
    int tf_fd = fileno(tf_out);
    ftruncate(tf_fd, __bytes_size);

    T *tf_mpd = (T *)mmap(nullptr, __bytes_size, PROT_READ | PROT_WRITE, MAP_SHARED, tf_fd, 0);
    if (tf_mpd == MAP_FAILED)
    {
        fclose(tf_out);
        cout << "Error mmapping the file\n";
        exit(EXIT_FAILURE);
    }

    memcpy(tf_mpd, __pbuffer, __bytes_size);

    if (msync(tf_mpd, __bytes, MS_SYNC) == -1)
        cerr << "Error: could not sync the file to disk\n";

    if (munmap(tf_mpd, __bytes) == -1)
    {
        fclose(tf_out);
        cerr << "Error: could not un-mmap the file\n";
        exit(EXIT_FAILURE);
    }

    fclose(tf_out);

    ++_which_run;
    _v_temps.push_back(Temp<T>(temp_file_name));
}

template <class T>
void KwayMergeSort<T>::Merge()
{
    // The merge part can be skipped if previously the entire input file fit
    // in memory and thus was just dumped to `output_file without temp files
    if (_sorted_internally == true)
        return;

    FILE *f_out;
    if ((f_out = fopen(_output_file.c_str(), "wb")) == nullptr)
    {
        cerr << "Error: could not open output file " << _output_file << endl;
        exit(EXIT_FAILURE);
    }

    // Open the sorted temp files up for merging
    OpenTempFiles();

    priority_queue<Merge_Run_Unit<T>> out_queue;

    unsigned char byte;
    for (size_t i = 0; i < _v_temps.size(); ++i)
    {
        fread(&byte, 1, 1, _v_temps[i].stream);
        out_queue.push(Merge_Run_Unit<T>(static_cast<T>(byte), _v_temps[i].stream, _compare_function));
    }

    while (!out_queue.empty())
    {
        // Grab the lowest (first) element
        Merge_Run_Unit<T> lowest = out_queue.top();

        // output it to the output file
        fwrite(&lowest.data, 1, 1, f_out);

        // and remove from queue
        out_queue.pop();

        // Push the next byte from the lowest stream to the queue unless it's EOF
        fread(&byte, 1, 1, lowest.f);
        if (!feof(lowest.f))
            out_queue.push(Merge_Run_Unit<T>(static_cast<T>(byte), lowest.f, _compare_function));
    }

    // Clean up the temp files
    CloseTempFiles();
    fclose(f_out);
}

template <class T>
void KwayMergeSort<T>::OpenTempFiles()
{
    // Go through each temp file name and open its stream
    for (size_t i = 0; i < _v_temps.size(); ++i)
    {
        FILE *f;
        struct stat sb;

        // Save file stream if opened
        if ((f = fopen(_v_temps[i].name.c_str(), "rb")) != nullptr)
        {
            int tf_fd = fileno(f);

            if (fstat(tf_fd, &sb) == -1)
                cerr << "Error: could not get " << _v_temps[i].name << " size\n";

            T *tf_map = (T *)mmap(nullptr, sb.st_size, PROT_READ, MAP_PRIVATE, tf_fd, 0);
            if (tf_map == MAP_FAILED)
            {
                fclose(f);
                cout << "Error mmapping the file\n";
                exit(EXIT_FAILURE);
            }

            // _v_temp_files.push_back(f);
            _v_temps[i].stream = f;
            _v_temps[i].size = sb.st_size;
            _v_temps[i].map = tf_map;
        }

        // Threw an error otherwise
        else
        {
            cerr << "Unable to open temp file ("
                 << _v_temps[i].name
                 << "). The file might not exist"
                 << endl;
            exit(EXIT_FAILURE);
        }
    }
}

template <class T>
void KwayMergeSort<T>::CloseTempFiles()
{
    // Close and delete all temp files
    for (size_t i = 0; i < _v_temps.size(); ++i)
    {
        if (munmap(_v_temps[i].map, _v_temps[i].size) == -1)
        {
            fclose(_v_temps[i].stream);
            cerr << "Error: could not un-mmap the file\n";
            exit(EXIT_FAILURE);
        }

        fclose(_v_temps[i].stream);
        remove(_v_temps[i].name.c_str());
    }
}

/* Helpers */

double smart_time_output(
    const high_resolution_clock::time_point &__tstart,
    const high_resolution_clock::time_point &__tend)
{
    duration<double> seconds = __tend - __tstart;
    duration<double, std::milli> ms_double = seconds;

    if (ms_double.count() < 1000)
        cout << fixed_float(ms_double.count()) << " ms" << endl;
    else
        cout << fixed_float(seconds.count()) << " s" << endl;

    return seconds.count();
}

string stl_basename(const string &__path)
{
    string result;

    char *path_dup = strdup(__path.c_str());
    char *basename_part = basename(path_dup);
    result = basename_part;
    free(path_dup);

    size_t pos = result.find_last_of('.');
    if (pos != string::npos)
        result = result.substr(0, pos);

    return result;
}

#endif /* KWAYMERGESORT_H */