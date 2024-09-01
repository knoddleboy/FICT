import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class Queue {
  private int put, take, count;

  private final int capacity;
  private final int[] items;

  private final ReentrantLock lock = new ReentrantLock();
  private final Condition itemsAvailable = lock.newCondition();

  private int nReceived;
  private int nRejected;

  public Queue(int capacity) {
    this.capacity = capacity;
    put = take = count = 0;
    items = new int[capacity];
  }

  public int getReceivedCount() {
    return nReceived;
  }

  public int getRejectedCount() {
    return nRejected;
  }

  public int getCount() {
    return count;
  }

  public void take() {
    lock.lock();

    try {
      while (count == 0) {
        itemsAvailable.await();
      }

      count--;

      if (++take == capacity) {
        take = 0;
      }
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    } finally {
      lock.unlock();
    }
  }

  public void put(int value) {
    lock.lock();

    try {
      nReceived++;
      if (count == capacity) {
        nRejected++;
        return;
      }

      items[put] = value;
      count++;

      if (++put == capacity) {
        put = 0;
      }

      itemsAvailable.signal();
    } finally {
      lock.unlock();
    }
  }
}
