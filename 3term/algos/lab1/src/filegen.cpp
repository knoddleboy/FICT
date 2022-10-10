#include <iostream>
#include <cstdio>
#include <cassert>
#include <vector>
#include <numeric>
#include <random>
#include <chrono>

int main(int argc, char **argv)
{
    if (argc != 3)
    {
        std::cout << "Wrong number of arguments.\n\tUsage: " << argv[0] << " <out_file_path> <out_size_bytes>\n";
        exit(1);
    }

    const char *out_path = argv[1];
    uint64_t buffer_size = atoi(argv[2]);

    assert(buffer_size % sizeof(uint64_t) == 0);

    auto time_start = std::chrono::high_resolution_clock::now();

    FILE *out = fopen(out_path, "wb");

    std::vector<uint64_t> data(buffer_size / sizeof(uint64_t));
    std::iota(data.begin(), data.end(), 0);
    std::shuffle(data.begin(), data.end(), std::mt19937{std::random_device{}()});

    fwrite((uint64_t *)&data[0], sizeof(uint64_t), data.size(), out);

    auto time_end = std::chrono::high_resolution_clock::now();

    fclose(out);

    std::chrono::duration<double> seconds = time_end - time_start;
    std::chrono::duration<double, std::milli> ms_double = seconds;

    std::cout << "--- " << out_path << " filled in " << seconds.count() << " seconds ---\n";

    return 0;
}