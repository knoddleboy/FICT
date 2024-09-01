import java.util.HashMap;

public class Timer {
  private final HashMap<String, Long> timerMap = new HashMap<>();

  public void start(String key) {
    timerMap.put(key, System.currentTimeMillis());
  }

  public void end(String key) {
    long startTime = get(key);
    timerMap.put(key, System.currentTimeMillis() - startTime);
  }

  public long get(String key) {
    return timerMap.get(key);
  }
}
