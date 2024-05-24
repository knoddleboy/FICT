public class CounterThread extends Thread {
  private Counter counter;
  private int times;
  private boolean increment;

  public CounterThread(Counter counter, int times, boolean increment) {
    this.counter = counter;
    this.times = times;
    this.increment = increment;
  }

  @Override
  public void run() {
    for (int i = 0; i < times; i++) {
      if (increment) {
        counter.increment();
      } else {
        counter.decrement();
      }
    }
  }
}
