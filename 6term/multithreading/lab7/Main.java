import java.util.Locale;
import mpi.*;

public class Main {
  private static final int MASTER = 0;
  private static final int size = 1000;

  public static void main(String[] args) {
    Matrix a = new Matrix(size).randomize();
    Matrix b = new Matrix(size).randomize();
    Matrix result = new Matrix(a.rows(), b.cols());

    MPI.Init(args);

    int currentProcess = MPI.COMM_WORLD.Rank();
    int nProcesses = MPI.COMM_WORLD.Size();

    if (nProcesses < 2) {
      MPI.COMM_WORLD.Abort(1);
      System.exit(1);
    }

    long startTime = System.currentTimeMillis();

    int rowsPerWorker = a.rows() / nProcesses;
    int extraRows = a.rows() % nProcesses;

    int[] reducedASizesPerProcess = new int[nProcesses];
    for (int i = 0; i < nProcesses; i++) {
      reducedASizesPerProcess[i] = rowsPerWorker * b.cols();

      if (i == nProcesses - 1) {
        reducedASizesPerProcess[i] += extraRows * b.cols();
      }
    }

    int[] offsets = new int[nProcesses];
    for (int i = 1; i < nProcesses; i++) {
      offsets[i] = reducedASizesPerProcess[i - 1] + offsets[i - 1];
    }

    double[] reducedA = a.reduce();
    double[] reducedB = b.reduce();
    double[] reducedResult = result.reduce();

    int reducedASize = reducedASizesPerProcess[currentProcess];
    double[] buffSubA = new double[reducedASize];

    MPI.COMM_WORLD.Scatterv(reducedA, 0, reducedASizesPerProcess, offsets, MPI.DOUBLE,
        buffSubA, 0, reducedASize, MPI.DOUBLE, MASTER);

    MPI.COMM_WORLD.Bcast(reducedB, 0, reducedA.length, MPI.DOUBLE, MASTER);

    Matrix subA = new Matrix(buffSubA, reducedASize / a.cols(), a.cols());
    Matrix B = new Matrix(reducedB, b.rows(), b.cols());

    double[] partialResult = subA.multiply(B).reduce();

    MPI.COMM_WORLD.Gatherv(partialResult, 0, partialResult.length, MPI.DOUBLE,
        reducedResult, 0, reducedASizesPerProcess, offsets, MPI.DOUBLE, MASTER);

    if (currentProcess == MASTER) {
      Matrix resultMatrix = new Matrix(reducedResult, a.rows(), b.cols());

      System.out.println(String.format(Locale.US, "[Collective]\t|%dx%d * %dx%d|\twith %d processes:\n",
          a.rows(), a.cols(), b.rows(), b.cols(), nProcesses) +
          "Elapsed:\t " + (System.currentTimeMillis() - startTime) + " ms");
    }

    MPI.Finalize();
  }
}
