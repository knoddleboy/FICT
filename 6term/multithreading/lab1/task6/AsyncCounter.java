public class AsyncCounter extends Counter {
  @Override
  public void increment() {
    count++;
  }

  @Override
  public void decrement() {
    count--;
  }
}
