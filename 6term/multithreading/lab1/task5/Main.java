public class Main {
  private static final int LINES = 100;
  private static final int MAX_PER_LINE = 100;

  public static void main(String[] args) {
    Printer printer = new Printer(LINES, MAX_PER_LINE);

    Thread thread1 = new Thread(new SymbolPrinter(printer, '-', true));
    Thread thread2 = new Thread(new SymbolPrinter(printer, '|', false));

    thread1.start();
    thread2.start();
  }
}