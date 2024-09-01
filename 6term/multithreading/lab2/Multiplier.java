public abstract class Multiplier {
  protected abstract Matrix unsafeMultiply(Matrix A, Matrix B, int numThreads);

  public final Matrix multiply(Matrix A, Matrix B) {
    canMultiply(A, B);
    return unsafeMultiply(A, B, 0);
  }

  public final Matrix multiply(Matrix A, Matrix B, int numThreads) {
    if (numThreads < 1) {
      throw new IllegalArgumentException("Number of threads must be at least 1.");
    }

    canMultiply(A, B);
    return unsafeMultiply(A, B, numThreads);
  }

  protected final void waitForThreads(Thread[] threads) {
    for (Thread thread : threads) {
      try {
        thread.join();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }

  public static final void canMultiply(Matrix A, Matrix B) throws IllegalArgumentException {
    boolean canMultiply = A.cols == B.rows;

    if (!canMultiply) {
      throw new IllegalArgumentException("Matrices cannot be multiplied: Incompatible dimensions.");
    }
  }
}