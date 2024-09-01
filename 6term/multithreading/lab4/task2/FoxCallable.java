import java.util.concurrent.Callable;

public class FoxCallable implements Callable<Matrix> {
  private Matrix a;
  private Matrix b;
  private Matrix result;

  public FoxCallable(Matrix a, Matrix b, Matrix result) {
    this.a = a;
    this.b = b;
    this.result = result;
  }

  @Override
  public Matrix call() throws Exception {
    return result.add(a.multiply(b));
  }
}
