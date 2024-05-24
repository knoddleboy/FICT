public class SymbolPrinter implements Runnable {
  private final Printer printer;
  private final char symbol;
  private final boolean shouldPrintFirst;

  public SymbolPrinter(Printer printer, char symbol, boolean shouldPrintFirst) {
    this.printer = printer;
    this.symbol = symbol;
    this.shouldPrintFirst = shouldPrintFirst;
  }

  @Override
  public void run() {
    while (true) {
      printer.print(symbol, shouldPrintFirst);

      if (printer.isFinished()) {
        return;
      }
    }
  }
}