public class BankAsync extends Bank {
  public BankAsync(int numAccounts, int initialBalance) {
    super(numAccounts, initialBalance);
  }

  @Override
  public void transfer(int from, int to, int amount) {
    accounts[from] -= amount;
    accounts[to] += amount;

    ntransacts++;

    if (ntransacts % NTEST == 0) {
      test();
    }
  }
}
