public abstract class Counter {
  protected int count = 0;

  public abstract void increment();

  public abstract void decrement();

  public int getCount() {
    return count;
  };
}
