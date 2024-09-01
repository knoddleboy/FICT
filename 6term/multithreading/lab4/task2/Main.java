import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    Locale.setDefault(Locale.US);

    int[] sizes = { 750 };
    int[] threads = { 4 };

    int nIterations = 3;

    for (int thread : threads) {
      System.out.println(thread + " threads\n");
      for (int size : sizes) {
        System.out.println(size + "x" + size);

        long esTotalTime = 0;
        long fjpTotalTime = 0;

        for (int i = 0; i < nIterations; i++) {
          Matrix a = new Matrix(size).randomize();
          Matrix b = new Matrix(size).randomize();

          long startTime = System.currentTimeMillis();
          Fox fox = new Fox(thread);
          Matrix foxResult = fox.multiply(a, b);
          esTotalTime += System.currentTimeMillis() - startTime;

          startTime = System.currentTimeMillis();
          FoxFJP foxFJP = new FoxFJP(thread);
          Matrix foxFJPResult = foxFJP.multiply(a, b);
          fjpTotalTime += System.currentTimeMillis() - startTime;

          if (!foxResult.equals(foxFJPResult)) {
            System.err.println("Error");
          }
        }

        long esAvgTime = esTotalTime / nIterations;
        long fjpAvgTime = fjpTotalTime / nIterations;

        System.out.println("  ES:      " + esAvgTime + " ms");
        System.out.println("  FJP:     " + fjpAvgTime + " ms");

        float speedUp = ((float) esAvgTime / (float) fjpAvgTime);
        System.out.println(String.format("Speed up:  %.2f\n", speedUp));
      }
      System.out.println();
    }
  }
}
