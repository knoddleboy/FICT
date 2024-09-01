import java.util.ArrayList;
import java.util.Locale;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class Main {
  public static void main(String[] args) throws InterruptedException, ExecutionException {
    Locale.setDefault(Locale.US);

    int nSystems = 20;

    ExecutorService executor = Executors.newFixedThreadPool(nSystems);
    var systemsResults = new ArrayList<Future<ArrayList<Float>>>();

    for (int i = 0; i < nSystems; i++) {
      MassSystem system = new MassSystem(i);
      systemsResults.add(executor.submit(system));
    }
    executor.shutdown();

    float avgQueueLength = 0;
    float avgRejProb = 0;

    for (var systemResults : systemsResults) {
      var stats = systemResults.get();

      if (stats != null) {
        avgQueueLength += stats.get(0);
        avgRejProb += stats.get(1);
      }
    }

    float totalAvgQueueLength = avgQueueLength / ((float) nSystems);
    float totalAvgRejProb = avgRejProb / ((float) nSystems);
    float totalAvgRejProbPct = totalAvgRejProb * 100;

    System.out.println(
        String.format("Total (%d systems):\n", nSystems) +
            String.format("  Avg queue length:\t%.3f\n", totalAvgQueueLength) +
            String.format("  Avg rejection prob:\t%f   ~%.2f%%", totalAvgRejProb, totalAvgRejProbPct));
  }
}
