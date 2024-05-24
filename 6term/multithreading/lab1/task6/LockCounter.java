import java.util.concurrent.locks.ReentrantLock;

public class LockCounter extends Counter {
  private final ReentrantLock lock = new ReentrantLock();

  @Override
  public void increment() {
    lock.lock();
    try {
      count++;
    } finally {
      lock.unlock();
    }
  }

  @Override
  public void decrement() {
    lock.lock();
    try {
      count--;
    } finally {
      lock.unlock();
    }
  }
}
