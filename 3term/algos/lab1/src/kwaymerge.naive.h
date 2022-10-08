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
#include <cmath>

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

class TempFile
{
public:
    fstream *_addr;
    string _name;

    TempFile(fstream *addr,
             string name)
        : _addr(addr),
          _name(name)
    {
    }

    int get()
    {
        int _buf;
        int pos = _addr->tellg();
        *_addr >> _buf;
        _addr->seekg(pos);
        return _buf;
    }

    bool eof()
    {
        bool is_eof = false;
        int pos = _addr->tellg();
        int next_mv;
        *_addr >> next_mv;
        if (_addr->eof())
            is_eof = true;
        _addr->seekg(pos);
        return is_eof;
    }
};

template <class T>
class KwayMergeSortNaive
{

public:
    KwayMergeSortNaive(
        const string &input_file,
        ostream *out_stream,
        bool (*compare_function)(const T &x, const T &y) = nullptr,
        string temp_file = "./temp");

    KwayMergeSortNaive(
        const string &input_file,
        ostream *out_stream,
        string temp_file = "./temp");

    ~KwayMergeSortNaive(void);

    void Sort();

private:
    // Constructor originated values
    string _input_file;
    ostream *_out_stream;
    bool (*_compare_function)(const T &x, const T &y);
    string _temp_file;

    bool _temp_file_used;
    size_t _which_run;

    vector<string> _v_temp_file_names; // contains temp file names
    vector<ifstream *> _v_temp_files;  // contains pointers on opened temp files' streams

    // size_t _temps_beg = 0;
    // size_t _temps_mid = 0;

    // Drives the devision of the input file into sub-files stored on disk
    void DistributeInitialRuns();

    // Drives the merging of the sorted temp files.
    // Eventually sorted and merged output is written to `out_stream`
    void Merge();

    // Writes sorted chunk of data to a temp file
    void WriteTempFile(const T &line, const int &file, const string &name);

    void ClearFile(TempFile &tf);

    // Open and close temp files
    void OpenTempFiles();
    void CloseTempFiles();
};

// Constructor
template <class T>
KwayMergeSortNaive<T>::KwayMergeSortNaive(const string &input_file,
                                          ostream *out_stream,
                                          bool (*compare_function)(const T &x, const T &y),
                                          string temp_file)
    : _input_file(input_file),
      _out_stream(out_stream),
      _compare_function(compare_function),
      _temp_file(temp_file),
      _which_run(0)
{
}

// Constructor without compare function
template <class T>
KwayMergeSortNaive<T>::KwayMergeSortNaive(const string &input_file,
                                          ostream *out_stream,
                                          string temp_file)
    : _input_file(input_file),
      _out_stream(out_stream),
      _compare_function(nullptr),
      _temp_file(temp_file),
      _which_run(0)
{
}

// Destructor
template <class T>
KwayMergeSortNaive<T>::~KwayMergeSortNaive(void)
{
}

// Sorting API
template <class T>
void KwayMergeSortNaive<T>::Sort()
{
    int gg;
    const int n = 6, nh = n / 2;
    int buf = -1, prev;

    vector<TempFile> f;

    int i, j, mx, tx, k1, k2, l, x, min, pos;
    vector<int> t;  // map
    vector<int> ta; // map

    // open main file f0
    istream *f0 = new ifstream(_input_file.c_str(), ios::in);

    // Exit if file opened with error (or did not open)
    if (f0->good() == false)
    {
        cerr << "Error: Could not open input file (" << _input_file << "). Exiting." << endl;
        exit(1);
    }

    // distribute initial runs to t[1]...t[nh]
    for (size_t i = 0; i < n; ++i)
    {
        string temp_name;
        if (_temp_file.size() == 0)
            temp_name = to_string(i);
        else
            temp_name = _temp_file + "/" + to_string(i);

        const char *temp_name_c = temp_name.c_str();

        ofstream *temp = new ofstream(temp_name_c, ios::out);
        temp->close();
        delete temp;

        fstream *f_temp = new fstream(temp_name_c, ios::in | ios::out | ios::app);
        f.push_back(TempFile(f_temp, temp_name));
    }

    j = 0;
    l = 0;
    while (!f0->eof()) // distribute among first n/2 files
    {
        prev = buf;
        *f0 >> buf;

        if (buf > prev)
            *f[j]._addr << buf << endl;
        else
        {
            ++l;
            ++j;
            if (j == nh)
                j = 0;

            *f[j]._addr << buf << endl;
        }
    }

    cout << "distributed!\n";
    cin.get();

    for (int i = 0; i < n; ++i)
        t.push_back(i);

    bool initial_pass = true;

    // merge from t[0]...t[nh-1] to t[nh]...t[n-1]]
    do
    {
        // In case if all runs fit in first n/2 files
        if (l < nh)
            k1 = l - 1; // k1 - number of input files in this phase
        else
            k1 = nh - 1; // -1 since used for indexing

        cout << "k1 = " << k1 << endl;

        for (size_t i = 0; i <= k1; ++i)
        {
            f[t[i]]._addr->seekg(0, ios::beg); // reset(f[t[i]])
            // list(f[t[i]], t[i])

            if (initial_pass)
                ta.push_back(t[i]);
            else
                ta[i] = t[i];
        }

        if (initial_pass)
            initial_pass = false;

        cout << "ta: ";
        for (size_t i = 0; i < ta.size(); ++i)
            cout << ta[i] << " ";
        cout << endl;

        l = 0;  // number of runs merged
        j = nh; // index of the first output tape

        // merge a run from t[0]...t[k1] to t[j]
        do
        {
            k2 = k1; // k2 - number of active input files
            ++l;

            cout << "k1 = " << k1 << endl;
            cout << "k2 = " << k2 << endl;
            cout << "j = " << j << endl;

            // select minimal element among all first runs
            do
            {
                i = 0;
                mx = 0; // index of min element

                min = f[ta[0]].get();

                cout << "start min: " << min << endl;

                while (i < k2)
                {
                    ++i;
                    x = f[ta[i]].get();

                    cout << "may be (x): " << x << endl;

                    if (x < min)
                    {
                        min = x;
                        mx = i;
                    }

                    cout << "res min: " << min << endl;
                }

                *f[ta[mx]]._addr >> buf;
                cout << "extract " << buf << " from " << ta[mx] << " file\n";

                *f[t[j]]._addr << buf << endl;
                cout << "insert into " << t[j] << " file\n";

                bool eot = f[ta[mx]].eof();
                cout << "eof? " << eot << endl;

                if (eot)
                {
                    ClearFile(f[ta[mx]]); // eliminate tape

                    cout << "before ta: ";
                    for (size_t i = 0; i < ta.size(); ++i)
                        cout << ta[i] << " ";
                    cout << endl;

                    cout << "before: "
                         << "k2 = " << k2 << ", k1 = " << k1 << endl;
                    cout << ta[mx] << " = " << ta[k2] << endl;
                    cout << ta[k2] << " = " << ta[k1] << endl;

                    ta[mx] = ta[k2];
                    ta[k2] = ta[k1];
                    --k1;
                    --k2;

                    cout << "after: "
                         << "k2 = " << k2 << ", k1 = " << k1 << endl;

                    cout << "after ta: ";
                    for (size_t i = 0; i < ta.size(); ++i)
                        cout << ta[i] << " ";
                    cout << endl;
                }
                else if (buf > f[ta[mx]].get())
                {
                    cout << buf << " > " << f[ta[mx]].get() << endl;

                    cout << "before ta: ";
                    for (size_t i = 0; i < ta.size(); ++i)
                        cout << ta[i] << " ";
                    cout << endl;

                    tx = ta[mx];
                    ta[mx] = ta[k2];
                    ta[k2] = tx;
                    --k2;

                    cout << "after ta: ";
                    for (size_t i = 0; i < ta.size(); ++i)
                        cout << ta[i] << " ";
                    cout << endl;

                    cout << "k2 = " << k2 << endl;
                }
                // cin.get();
            } while (k2 > 0);

            if (j < n - 1)
                ++j;
            else
                j = nh;

            cout << "j now = " << j << endl;

        } while (k1 > 0);

        for (size_t i = 0; i < nh; ++i)
        {
            tx = t[i];
            t[i] = t[nh + i];
            t[nh + i] = tx;
        }

        cout << "t now: ";
        for (size_t i = 0; i < t.size(); ++i)
            cout << t[i] << " ";
        cout << endl;

    } while (l > 1);

    cout << "finished!\n";

    for (size_t i = 0; i < f.size(); ++i)
    {
        f[i]._addr->close();
        cout << "closing " << f[i]._addr << endl;
        delete f[i]._addr;
    }
}

template <class T>
void KwayMergeSortNaive<T>::ClearFile(TempFile &tf)
{
    cout << "clearing: " << tf._name << endl;
    // close file
    tf._addr->close();

    // reopen truncating and close
    ofstream *ofs = new ofstream(tf._name.c_str(), ios::out | ios::trunc);
    ofs->close();
    delete ofs;

    // open in fstream
    fstream *fs = new fstream(tf._name.c_str(), ios::in | ios::out | ios::app);
    tf._addr = fs;
    delete fs;
}

template <class T>
void KwayMergeSortNaive<T>::WriteTempFile(const T &line, const int &file, const string &name)
{
    string temp_file_name;
    if (_temp_file.size() == 0)
        temp_file_name = name + "." + to_string(file);
    else
        temp_file_name = _temp_file + "/" + stl_basename(name) + "." + to_string(file);

    ofstream *output = new ofstream(temp_file_name.c_str(), ios::out | ios::app);

    // Write the line to a temp file
    *output << line << endl;

    // Close temp file and add its name to the list
    output->close();
    delete output;

    // Add temp file name to a list unless it's already there
    if (find(
            _v_temp_file_names.begin(),
            _v_temp_file_names.end(),
            temp_file_name) == _v_temp_file_names.end())
        _v_temp_file_names.push_back(temp_file_name);
}

template <class T>
void KwayMergeSortNaive<T>::OpenTempFiles()
{
    // Go through each temp file name and open its stream
    for (size_t i = 0; i < _v_temp_file_names.size(); ++i)
    {
        ifstream *file = new ifstream(_v_temp_file_names[i].c_str(), ios::in);

        // Save file stream if opened successfully unless it's already there
        if (file->good() &&
            find(_v_temp_files.begin(),
                 _v_temp_files.end(), file) == _v_temp_files.end())
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
void KwayMergeSortNaive<T>::CloseTempFiles()
{
    // Close all temp files
    for (size_t i = 0; i < _v_temp_files.size(); ++i)
    {
        _v_temp_files[i]->close();
        delete _v_temp_files[i];
    }

    // and delete them
    // for (size_t i = 0; i < _v_temp_file_names.size(); ++i)
    //     remove(_v_temp_file_names[i].c_str());
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
