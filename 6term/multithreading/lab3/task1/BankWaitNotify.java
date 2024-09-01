public class BankWaitNotify extends Bank {
  public BankWaitNotify(int numAccounts, int initialBalance) {
    super(numAccounts, initialBalance);
  }

  @Override
  public synchronized void transfer(int from, int to, int amount) {
    while (accounts[from] < amount) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }

    accounts[from] -= amount;
    accounts[to] += amount;

    ntransacts++;

    notifyAll();

    if (ntransacts % NTEST == 0) {
      test();
    }
  }
}
