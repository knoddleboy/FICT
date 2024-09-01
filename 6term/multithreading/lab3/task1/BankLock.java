import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class BankLock extends Bank {
  private Lock lock = new ReentrantLock();

  public BankLock(int numAccounts, int initialBalance) {
    super(numAccounts, initialBalance);
  }

  @Override
  public void transfer(int from, int to, int amount) {
    lock.lock();

    try {
      accounts[from] -= amount;
      accounts[to] += amount;

      ntransacts++;

      if (ntransacts % NTEST == 0) {
        test();
      }
    } finally {
      lock.unlock();
    }
  }
}
