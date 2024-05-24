public class BallThreadJoin extends BallThread {
  private final BallThread prevThread;

  public BallThreadJoin(Ball b, BallThread prevThread) {
    super(b);
    this.prevThread = prevThread;
  }

  @Override
  public void run() {
    try {
      prevThread.join();
      super.run();
    } catch (InterruptedException e) {
      super.interrupt();
    } finally {
      ball.clear();
    }
  }
}
