import java.util.*;

public class Purchase {
  private final String customerId;
  private final Date purchaseDate;
  private final List<String> items;

  public Purchase(String customerId, Date purchaseDate, List<String> items) {
    this.customerId = customerId;
    this.purchaseDate = purchaseDate;
    this.items = items;
  }

  public String getCustomerId() {
    return customerId;
  }

  public Date getPurchaseDate() {
    return purchaseDate;
  }

  public List<String> getItems() {
    return items;
  }
}
