import java.util.concurrent.ForkJoinPool;

public class FoxFJP {
  private final ForkJoinPool pool;

  public FoxFJP(int nThreads) {
    this.pool = new ForkJoinPool(nThreads);
  }

  public Matrix multiply(Matrix a, Matrix b) {
    return pool.invoke(new FoxTask(a, b));
  }
}
