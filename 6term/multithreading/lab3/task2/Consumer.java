public class Consumer implements Runnable {
  private Drop drop;

  public Consumer(Drop drop) {
    this.drop = drop;
  }

  public void run() {
    for (int i = 0; i < drop.getCapacity(); i++) {
      drop.take();
    }
  }
}
