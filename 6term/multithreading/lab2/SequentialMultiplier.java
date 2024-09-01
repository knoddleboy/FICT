public class SequentialMultiplier extends Multiplier {
  @Override
  protected Matrix unsafeMultiply(Matrix A, Matrix B, int numThreads) {
    Matrix result = Matrix.multiply(A, B);
    return result;
  }
}