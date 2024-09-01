public class FoxMultiplier extends Multiplier {
  private int numThreadsWaiting = 0;
  private WorkerThread[] threads;
  private int numBlocks;

  @Override
  protected Matrix unsafeMultiply(Matrix A, Matrix B, int numThreads) {
    numBlocks = (int) Math.sqrt(numThreads);

    if (numBlocks * numBlocks != numThreads) {
      throw new IllegalArgumentException("Fox algorithm requires the number of threads to be a perfect square.");
    }

    int rowsA = A.rows;
    int colsB = B.cols;

    Matrix result = new Matrix(rowsA, colsB);
    threads = new WorkerThread[numThreads];
    int threadIndex = 0;

    for (int i = 0; i < numBlocks; i++) {
      for (int j = 0; j < numBlocks; j++) {
        int[][] blockA = A.getBlock(numBlocks, numBlocks, i, i);
        int[][] blockB = B.getBlock(numBlocks, numBlocks, i, j);

        threads[threadIndex] = new WorkerThread(blockA, blockB, A, B, this, numBlocks, i, j);
        threads[threadIndex].start();
        threadIndex++;
      }
    }

    waitForThreads(threads);

    for (WorkerThread workerThread : threads) {
      result.write(workerThread.resultBlock, workerThread.rows, workerThread.cols, (int) Math.sqrt(numThreads));
    }

    return result;
  }

  protected synchronized void waitAndTransfer(int iter, Matrix A, Matrix B) {
    numThreadsWaiting++;

    if (numThreadsWaiting != threads.length) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    } else {
      numThreadsWaiting = 0;

      for (int i = 0; i < threads.length; i++) {
        int blockIndex = (threads[i].rows + iter + 1) % numBlocks;
        int[][] blockA = A.getBlock(numBlocks, numBlocks, threads[i].rows, blockIndex);
        int[][] blockB = B.getBlock(numBlocks, numBlocks, blockIndex, threads[i].cols);
        threads[i].setBlocks(blockA, blockB);
      }

      notifyAll();
    }
  }

  private static class WorkerThread extends Thread {
    private int[][] blockA;
    private int[][] blockB;
    private final Matrix A;
    private final Matrix B;
    private final FoxMultiplier invoker;
    private final int numIters;
    protected int[][] resultBlock;
    protected int rows;
    protected int cols;

    public WorkerThread(int[][] blockA, int[][] blockB, Matrix A, Matrix B, FoxMultiplier invoker, int numIters,
        int rows,
        int cols) {
      this.blockA = blockA;
      this.blockB = blockB;
      this.A = A;
      this.B = B;
      this.invoker = invoker;
      this.numIters = numIters;
      this.rows = rows;
      this.cols = cols;
      this.resultBlock = new int[blockA.length][blockB[0].length];
    }

    public void setBlocks(int[][] blockA, int[][] blockB) {
      this.blockA = blockA;
      this.blockB = blockB;
    }

    @Override
    public void run() {
      for (int i = 0; i < numIters; i++) {
        int[][] multipliedBlock = Matrix.multiply(blockA, blockB);
        Matrix.add(resultBlock, multipliedBlock);
        invoker.waitAndTransfer(i, A, B);
      }
    }
  }
}
