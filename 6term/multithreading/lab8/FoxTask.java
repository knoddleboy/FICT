import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.RecursiveTask;

public class FoxTask extends RecursiveTask<Matrix> {
  private Matrix a;
  private Matrix b;

  private final int nBlocks = 2; // matrix splits into 4 submatrices (2x2 matrix of blocks) on each rec. step
  private final int minRows = 128; // at this point, recursion stops, and the submatrices are multiplied

  public FoxTask(Matrix a, Matrix b) {
    this.a = a;
    this.b = b;
  }

  @Override
  protected Matrix compute() {
    if (a.rows() <= minRows) {
      return a.multiply(b);
    }

    Matrix result = new Matrix(a.rows(), b.cols());

    Matrix[][] blocksA = a.split(nBlocks);
    Matrix[][] blocksB = b.split(nBlocks);
    Matrix[][] resultBlocks = result.split(nBlocks);

    for (int k = 0; k < nBlocks; k++) {
      ArrayList<FoxTask> tasks = new ArrayList<>();
      List<Matrix> blocks = new ArrayList<>();

      for (int i = 0; i < nBlocks; i++) {
        for (int j = 0; j < nBlocks; j++) {
          FoxTask task = new FoxTask(
              blocksA[i][(i + k) % nBlocks],
              blocksB[(i + k) % nBlocks][j]);

          tasks.add(task);
          task.fork();
        }
      }

      for (FoxTask task : tasks) {
        Matrix block = task.join();
        blocks.add(block);
      }

      for (int i = 0; i < nBlocks; i++) {
        for (int j = 0; j < nBlocks; j++) {
          try {
            resultBlocks[i][j] = resultBlocks[i][j].add(blocks.get(i * nBlocks + j));
          } catch (Exception e) {
          }
        }
      }
    }

    return result.collect(resultBlocks);
  }
}
