public class BallThread extends Thread {
  protected Ball ball;

  public BallThread(Ball b) {
    this.ball = b;
  }

  @Override
  public void run() {
    try {
      while (!ball.isInHole()) {
        ball.move();
        Thread.sleep(5);
      }

      System.out.println(Thread.currentThread().getName());

      HitsCounter.getInstance().increment();
    } catch (InterruptedException e) {
    } finally {
      ball.clear();
    }
  }

  public Ball getBall() {
    return ball;
  }
}