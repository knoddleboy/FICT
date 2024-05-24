public class Main {
  private static final int THREADS = 64;
  private static final int TIMES = 1000000;

  public static void main(String[] args) throws InterruptedException {
    Counter[] counters = {
        new AsyncCounter(),
        new SyncMethodCounter(),
        new SyncBlockCounter(),
        new LockCounter()
    };

    CounterThread[] threads = new CounterThread[THREADS];

    for (Counter counter : counters) {
      for (int i = 0; i < THREADS; i++) {
        threads[i] = new CounterThread(counter, TIMES, i % 2 == 0);
      }

      long startTime = System.nanoTime();

      for (Thread thread : threads) {
        thread.start();
      }

      for (Thread thread : threads) {
        thread.join();
      }

      long elapsedMillis = (System.nanoTime() - startTime) / 1_000_000;

      System.out.println(
          counter.getClass() + "\t"
              + counter.getCount() + "\t"
              + (float) elapsedMillis / 1_000 + "s");
    }
  }
}
