import java.util.*;
import java.util.concurrent.ForkJoinPool;

public class Main {
  private static final int nCustomers = 1_000_000;
  private static final int MAX_ITEMS = 100;

  public static void main(String[] args) {
    List<Purchase> data = new ArrayList<>();
    createCustomersData(data);

    long startTime = System.currentTimeMillis();

    ForkJoinPool pool = new ForkJoinPool();
    PurchaseAnalysisTask task = new PurchaseAnalysisTask(data);
    Map<String, Integer> purchaseCountMap = pool.invoke(task);

    long endTime = System.currentTimeMillis() - startTime;

    int maxPurchases = purchaseCountMap.values().stream().max(Integer::compare).orElse(0);
    long customerMoreThan12 = purchaseCountMap.values().stream().filter(count -> count > 12).count();

    System.out.println("Maximum purchases by a single customer: " + maxPurchases);
    System.out.println("Number of customers with more than 12 purchases: " + customerMoreThan12);

    System.out.println("Elapsed: " + endTime + " ms");
  }

  private static void createCustomersData(List<Purchase> data) {
    Random random = new Random();
    for (int i = 0; i < nCustomers; i++) {
      String customerId = "" + random.nextInt(nCustomers);
      Date purchaseDate = new Date();

      int nItems = random.nextInt(MAX_ITEMS) + 1;
      Set<String> itemsSet = new HashSet<>();

      while (itemsSet.size() < nItems) {
        String item = "item#" + random.nextInt(100);
        itemsSet.add(item);
      }

      List<String> items = new ArrayList<>(itemsSet);
      data.add(new Purchase(customerId, purchaseDate, items));
    }
  }
}
