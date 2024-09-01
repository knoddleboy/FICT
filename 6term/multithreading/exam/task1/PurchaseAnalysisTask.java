import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.RecursiveTask;

public class PurchaseAnalysisTask extends RecursiveTask<Map<String, Integer>> {
  private static final int THRESHOLD = 10000;
  private List<Purchase> data;

  public PurchaseAnalysisTask(List<Purchase> data) {
    this.data = data;
  }

  @Override
  protected Map<String, Integer> compute() {
    if (data.size() <= THRESHOLD) {
      return process(data);
    }

    int mid = data.size() / 2;
    PurchaseAnalysisTask task1 = new PurchaseAnalysisTask(data.subList(0, mid));
    PurchaseAnalysisTask task2 = new PurchaseAnalysisTask(data.subList(mid, data.size()));

    task1.fork();

    Map<String, Integer> result2 = task2.compute();
    Map<String, Integer> result1 = task1.join();

    return mergeResults(result1, result2);
  }

  private Map<String, Integer> process(List<Purchase> data) {
    Map<String, Integer> purchaseCountMap = new HashMap<>();
    for (Purchase purchase : data) {
      purchaseCountMap.put(purchase.getCustomerId(),
          purchaseCountMap.getOrDefault(purchase.getCustomerId(), 0) + purchase.getItems().size());
    }
    return purchaseCountMap;
  }

  private Map<String, Integer> mergeResults(Map<String, Integer> result1, Map<String, Integer> result2) {
    for (Map.Entry<String, Integer> entry2 : result2.entrySet()) {
      result1.put(entry2.getKey(), result1.getOrDefault(entry2.getKey(), 0) + entry2.getValue());
    }
    return result1;
  }
}
