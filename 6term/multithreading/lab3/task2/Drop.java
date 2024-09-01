import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class Drop {
  private int put, take, count;

  private final int numItems;
  private final int[] items;

  private final ReentrantLock lock = new ReentrantLock();
  private final Condition spaceAvailable = lock.newCondition();
  private final Condition itemsAvailable = lock.newCondition();

  public Drop(int numItems) {
    this.numItems = numItems;
    put = take = count = 0;
    items = new int[numItems];
  }

  public int take() {
    lock.lock();

    try {
      while (count == 0) {
        itemsAvailable.await();
      }

      int value = items[take];
      count--;

      System.out.println(
          String.format("Took %-4d at index %d\tLeft: %d", value, take, count));

      if (++take == numItems) {
        take = 0;
      }

      spaceAvailable.signal();

      return value;
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    } finally {
      lock.unlock();
    }
  }

  public void put(int value) {
    lock.lock();

    try {
      while (count == numItems) {
        spaceAvailable.await();
      }

      items[put] = value;
      count++;

      System.out.println(
          String.format("Put  %-4d at index %d\tLeft: %d", value, put, count));

      if (++put == numItems) {
        put = 0;
      }

      itemsAvailable.signal();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    } finally {
      lock.unlock();
    }
  }

  public int getCapacity() {
    return numItems;
  }
}
