#ifndef KWAYMERGENAIVE_H
#define KWAYMERGENAIVE_H

#include <iostream>
#include <fstream>
#include <cstdio>
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

class TempFile
{
public:
    FILE *_addr;

    TempFile(FILE *addr)
        : _addr(addr)
    {
    }

    int get()
    {
        char *_buf = NULL;
        size_t len = 0;
        int pos = ftell(_addr);
        getline(&_buf, &len, _addr);
        fseek(_addr, pos, SEEK_SET);
        int res = atoi(_buf);
        free(_buf);
        return res;
    }

    bool eof()
    {
        bool is_eof = false;
        size_t len = 0;
        int pos = ftell(_addr);
        char *next_mv;
        getline(&next_mv, &len, _addr);
        if (feof(_addr))
            is_eof = true;
        fseek(_addr, pos, SEEK_SET);
        return is_eof;
    }
};

template <class T>
class KwayMergeSortNaive
{

public:
    KwayMergeSortNaive(
        const string &input_file,
        const string &out_stream,
        int k);

    ~KwayMergeSortNaive(void);

    void Sort();

private:
    // Constructor originated values
    string _input_file;
    string _output_file;

    int k; // ways

    bool _temp_file_used;
    size_t _which_run;

    vector<string> _v_temp_file_names; // contains temp file names
    vector<ifstream *> _v_temp_files;  // contains pointers on opened temp files' streams

    // Drives the devision of the input file into sub-files stored on disk
    void DistributeInitialRuns();

    // Drives the merging of the sorted temp files.
    // Eventually sorted and merged output is written to `out_stream`
    void Merge();
};

// Constructor
template <class T>
KwayMergeSortNaive<T>::KwayMergeSortNaive(const string &input_file,
                                          const string &output_file,
                                          int k)
    : _input_file(input_file),
      _output_file(output_file),
      k(k),
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
    const kh = k / 2;
    int buf = -1, prev;
    size_t len = 0;

    vector<TempFile> f;

    int i, j, mx, tx, k1, k2, l, x, min, pos;
    vector<int> t;  // map
    vector<int> ta; // map

    // open main file f0
    istream *f0 = new ifstream(_input_file.c_str(), ios::in);
    ostream *out = new ofstream(_output_file.c_str(), ios::out);

    // Exit if file opened with error (or did not open)
    if (f0->good() == false)
    {
        cerr << "Error: Could not open input file (" << _input_file << "). Exiting." << endl;
        exit(1);
    }

    // create temp files
    for (size_t i = 0; i < k; ++i)
    {
        FILE *f_temp = tmpfile();
        f.push_back(TempFile(f_temp));
    }

    auto t1 = high_resolution_clock::now();
    // distribute among first n/2 files
    j = 0;
    l = 0;
    while (!f0->eof())
    {
        prev = buf;
        *f0 >> buf;

        if (buf > prev)
            fprintf(f[i]._addr, "%d\n", buf);
        else
        {
            ++l;
            ++j;
            if (j == kh)
                j = 0;

            fprintf(f[i]._addr, "%d\n", buf);
        }
    }
    auto t2 = high_resolution_clock::now();
    printf("%-25s ", "Distribution");
    double t_das = smart_time_output(t1, t2);

    t1 = high_resolution_clock::now();
    // associate map
    for (int i = 0; i < k; ++i)
        t.push_back(i);

    bool initial_pass = true;

    // merge from t[0]...t[nh-1] to t[nh]...t[n-1]]
    do
    {
        // In case if all runs fit in first n/2 files
        if (l < kh)
            k1 = l - 1; // k1 - number of input files in this phase
        else
            k1 = kh - 1; // -1 since used for indexing
        for (size_t i = 0; i <= k1; ++i)
        {
            rewind(f[t[i]]._addr); // return to 0 pos

            if (initial_pass)
                ta.push_back(t[i]);
            else
                ta[i] = t[i];
        }
        if (initial_pass)
            initial_pass = false;

        l = 0;  // number of runs merged
        j = kh; // index of the first output tape

        // merge a run from t[0]...t[k1] to t[j]
        do
        {
            k2 = k1; // k2 - number of active input files
            ++l;
            // select minimal element among all first runs
            do
            {
                i = 0;
                mx = 0; // index of min element
                min = f[ta[0]].get();

                // check for other minimal
                while (i < k2)
                {
                    ++i;
                    x = f[ta[i]].get();
                    if (x < min)
                    {
                        min = x;
                        mx = i;
                    }
                }

                getline(&buf, &len, f[ta[mx]]._addr);
                fprintf(f[t[j]]._addr, "%d\n", buf);
                bool eot = f[ta[mx]].eof();

                if (eot)
                {
                    // reopen temp claring content
                    freopen("r+", f[ta[mx]]._addr);
                    ta[mx] = ta[k2];
                    ta[k2] = ta[k1];
                    --k1;
                    --k2;
                }
                // if next number if bigger than buf - switch temp files
                else if (buf > f[ta[mx]].get())
                {
                    tx = ta[mx];
                    ta[mx] = ta[k2];
                    ta[k2] = tx;
                    --k2;
                }
            } while (k2 > 0);

            // proccedd to the next temp
            if (j < k - 1)
                ++j;
            else
                j = kh;
        } while (k1 > 0);

        // switch temps
        for (size_t i = 0; i < kh; ++i)
        {
            tx = t[i];
            t[i] = t[kh + i];
            t[kh + i] = tx;
        }
    } while (l > 1);

    t2 = high_resolution_clock::now();
    printf("%-25s ", "Merge");
    double t_mrg = smart_time_output(t1, t2);
    printf("------\n%-25s %.3lfs\n", "Total", t_das + t_mrg);
    // result is in t[0]
    out = f[t[0]]._addr;
    out.close();
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

#endif /* KWAYMERGENAIVE_H */
