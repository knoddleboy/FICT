public class Printer {
  private int count = 0;
  private boolean isPrintTurn = true;
  private boolean finished = false;

  private final int lines;
  private final int maxPerLine;

  public Printer(int lines, int maxPerLine) {
    this.lines = lines;
    this.maxPerLine = maxPerLine;
  }

  public synchronized void print(char symbol, boolean shouldPrintFirst) {
    while (isPrintTurn != shouldPrintFirst) {
      try {
        wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }

    System.out.print(symbol);

    count++;
    if (count % maxPerLine == 0) {
      System.out.println();
    }

    isPrintTurn = !isPrintTurn;

    if (count + 1 == lines * maxPerLine) {
      finished = true;
    }

    notifyAll();
  }

  public synchronized boolean isFinished() {
    return finished;
  }
}