public class Main {
  public static final int NACCOUNTS = 10;
  public static final int INITIAL_BALANCE = 10000;

  public static void main(String[] args) {
    // Bank b = new BankAsync(NACCOUNTS, INITIAL_BALANCE);

    // Bank b = new BankSyncMethod(NACCOUNTS, INITIAL_BALANCE);
    // Bank b = new BankLock(NACCOUNTS, INITIAL_BALANCE);
    Bank b = new BankWaitNotify(NACCOUNTS, INITIAL_BALANCE);

    for (int i = 0; i < NACCOUNTS; i++) {
      TransferThread<Bank> t = new TransferThread<>(b, i, INITIAL_BALANCE);
      t.setPriority(Thread.NORM_PRIORITY + i % 2);
      t.start();
    }
  }
}
