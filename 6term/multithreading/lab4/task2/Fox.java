import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Fox {
  private final int nThreads;
  private final int nBlocks;

  public Fox(int nThreads) {
    this.nThreads = nThreads;
    this.nBlocks = (int) Math.sqrt(nThreads - 1) + 1;
  }

  public Matrix multiply(Matrix a, Matrix b) {
    Matrix result = new Matrix(a.rows(), b.cols());

    Matrix[][] blocksA = a.split(nBlocks);
    Matrix[][] blocksB = b.split(nBlocks);
    Matrix[][] resultBlocks = result.split(nBlocks);

    ExecutorService executor = Executors.newFixedThreadPool(nThreads);

    for (int k = 0; k < nBlocks; k++) {
      ArrayList<Future<Matrix>> futures = new ArrayList<Future<Matrix>>();

      for (int i = 0; i < nBlocks; i++) {
        for (int j = 0; j < nBlocks; j++) {
          FoxCallable task = new FoxCallable(
              blocksA[i][(i + k) % nBlocks],
              blocksB[(i + k) % nBlocks][j],
              resultBlocks[i][j]);

          futures.add(executor.submit(task));
        }
      }

      for (int i = 0; i < nBlocks; i++) {
        for (int j = 0; j < nBlocks; j++) {
          try {
            resultBlocks[i][j] = futures.get(i * nBlocks + j).get();
          } catch (Exception e) {
          }
        }
      }
    }
    executor.shutdown();

    return result.collect(resultBlocks);
  }
}
