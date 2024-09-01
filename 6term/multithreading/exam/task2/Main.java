import mpi.*;
import java.util.Arrays;
import java.util.Random;

public class Main {
  private static final int MASTER = 0;

  public static void main(String[] args) throws MPIException {
    MPI.Init(args);

    int rank = MPI.COMM_WORLD.Rank();
    int size = MPI.COMM_WORLD.Size();

    int arraySize = 10000;
    int[] array = new int[arraySize];

    if (rank == MASTER) {
      Random rand = new Random();
      for (int i = 0; i < arraySize; i++) {
        array[i] = rand.nextInt(100);
      }
      // System.out.println("Unsorted Array: " + Arrays.toString(array));
    }

    int subArraySize = arraySize / size;
    int[] subArray = new int[subArraySize];

    MPI.COMM_WORLD.Scatter(array, 0, subArraySize, MPI.INT, subArray, 0, subArraySize, MPI.INT, 0);

    Arrays.sort(subArray);
    System.out.println("Process " + rank + " sorted segment: " + Arrays.toString(subArray));

    int[] sortedArray = new int[arraySize];
    MPI.COMM_WORLD.Gather(subArray, 0, subArraySize, MPI.INT, sortedArray, 0, subArraySize, MPI.INT, 0);

    if (rank == MASTER) {
      sortedArray = mergeSortedSubArrays(sortedArray, subArraySize, size);
      System.out.println("Sorted Array: " + Arrays.toString(sortedArray));
    }

    MPI.Finalize();
  }

  private static int[] mergeSortedSubArrays(int[] array, int subArraySize, int numProcesses) {
    int[] result = new int[array.length];
    int[] pointers = new int[numProcesses];

    for (int i = 0; i < array.length; i++) {
      int minIndex = -1;
      int minValue = Integer.MAX_VALUE;

      for (int j = 0; j < numProcesses; j++) {
        if (pointers[j] < subArraySize && array[j * subArraySize + pointers[j]] < minValue) {
          minValue = array[j * subArraySize + pointers[j]];
          minIndex = j;
        }
      }

      result[i] = minValue;
      pointers[minIndex]++;
    }

    return result;
  }
}
