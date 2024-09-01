public class BlockStripedMultiplier extends Multiplier {
  private WorkerThread[] threads;
  private int numThreadsWaiting = 0;

  @Override
  protected Matrix unsafeMultiply(Matrix A, Matrix B, int numThreads) {
    int rowsA = A.rows;
    int colsB = B.cols;

    Matrix result = new Matrix(rowsA, colsB);
    threads = new WorkerThread[numThreads];

    for (int i = 0; i < numThreads; i++) {
      int[][] blockA = A.getRows(i, numThreads);
      int[][] blockB = B.getCols(i, numThreads);

      threads[i] = new WorkerThread(blockA, blockB, numThreads, result, i, this, B);
      threads[i].start();
    }

    waitForThreads(threads);

    return result;
  }

  protected synchronized void waitAndTransfer(int threadIteration, Matrix B) {
    numThreadsWaiting++;
    int numThreads = threads.length;

    if (numThreadsWaiting != numThreads) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    } else {
      numThreadsWaiting = 0;

      for (int i = 0; i < numThreads; i++) {
        int[][] block = B.getCols((i + threadIteration + 1) % numThreads, numThreads);
        threads[i].setCols(block);
      }

      notifyAll();
    }
  }

  private static class WorkerThread extends Thread {
    private int[][] rows;
    private int[][] cols;
    private int numIterations;
    private Matrix result;
    private int threadIndex;
    private BlockStripedMultiplier invoker;
    private Matrix B;

    public WorkerThread(
        int[][] rows,
        int[][] cols,
        int numIterations,
        Matrix result,
        int threadIndex,
        BlockStripedMultiplier invoker,
        Matrix B) {

      this.rows = rows;
      this.cols = cols;
      this.numIterations = numIterations;
      this.result = result;
      this.threadIndex = threadIndex;
      this.invoker = invoker;
      this.B = B;
    }

    public void setCols(int[][] cols) {
      this.cols = cols;
    }

    @Override
    public void run() {
      for (int i = 0; i < numIterations; i++) {
        int[][] multipliedBlock = Matrix.multiply(rows, cols);
        invoker.waitAndTransfer(i, B);
        result.write(multipliedBlock, threadIndex, (threadIndex + i) % numIterations, numIterations);
      }
    }
  }
}
