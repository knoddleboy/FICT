public class BankSyncMethod extends Bank {
  public BankSyncMethod(int numAccounts, int initialBalance) {
    super(numAccounts, initialBalance);
  }

  @Override
  public synchronized void transfer(int from, int to, int amount) {
    accounts[from] -= amount;
    accounts[to] += amount;

    ntransacts++;

    if (ntransacts % NTEST == 0) {
      test();
    }
  }
}
