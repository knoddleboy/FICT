abstract public class Bank implements BankInterface {
  public static final int NTEST = 10000;
  protected final int[] accounts;
  protected long ntransacts = 0;

  public Bank(int numAccounts, int initialBalance) {
    accounts = new int[numAccounts];

    for (int i = 0; i < accounts.length; i++) {
      accounts[i] = initialBalance;
    }

    ntransacts = 0;
  }

  abstract public void transfer(int from, int to, int amount);

  public void test() {
    int sum = 0;

    for (int i = 0; i < accounts.length; i++) {
      sum += accounts[i];
    }

    System.out.println("Transactions:" + ntransacts + "\tSum: " + sum);
  }

  public int size() {
    return accounts.length;
  }
}
