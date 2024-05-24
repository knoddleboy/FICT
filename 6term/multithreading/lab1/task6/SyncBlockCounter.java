public class SyncBlockCounter extends Counter {
  @Override
  public void increment() {
    synchronized (this) {
      count++;
    }
  }

  @Override
  public void decrement() {
    synchronized (this) {
      count--;
    }
  }
}