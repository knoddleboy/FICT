public class BallThread extends Thread {
  private Ball ball;

  public BallThread(Ball b, int priority) {
    this.ball = b;
    this.setPriority(priority);
  }

  @Override
  public void run() {
    try {
      for (int i = 0; i < 10000; i++) {
        ball.move();
        Thread.sleep(5);
      }
    } catch (InterruptedException ex) {
    }
  }

  public Ball getBall() {
    return ball;
  }
}