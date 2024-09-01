public class Main {
  public static void main(String[] args) {
    int[] sizes = { 500, 1000, 1500, 2000, 2500 };

    Multiplier[] multipliers = {
        // new SequentialMultiplier(),
        new BlockStripedMultiplier(),
        new FoxMultiplier()
    };

    for (Multiplier multiplier : multipliers) {
      System.out.println(multiplier.getClass().getName());

      for (int size : sizes) {
        Matrix A = new Matrix(size).generateAllOnes();
        Matrix B = new Matrix(size).generateAllOnes();

        long startTime = System.nanoTime();

        Matrix result = multiplier.multiply(A, B, 9);

        long elapsedMillis = (System.nanoTime() - startTime) / 1_000_000;

        System.err.println(size + "\t" + Matrix.isCorrectAllOnesProduct(result, A.cols) + "\t"
            + (float) elapsedMillis / 1_000 + "s");
      }
    }
  }
}
