import java.util.Random;

public class Producer implements Runnable {
  private final int bound = 1000;
  private Drop drop;

  public Producer(Drop drop) {
    this.drop = drop;
  }

  public void run() {
    Random rand = new Random();
    for (int i = 0; i < drop.getCapacity(); i++) {
      drop.put(rand.nextInt(bound));
    }
  }
}
