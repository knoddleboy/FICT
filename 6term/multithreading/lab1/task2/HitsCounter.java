public class HitsCounter {
  private static HitsCounter Instance;

  public static HitsCounter getInstance() {
    if (Instance == null) {
      Instance = new HitsCounter();
    }

    return Instance;
  }

  private int hits = 0;

  public int increment() {
    return hits++;
  }

  public int getHits() {
    return hits;
  }
}