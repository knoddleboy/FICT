class BallThread extends Thread {
  private Ball ball;

  public BallThread(Ball b) {
    ball = b;
  }

  @Override
  public void run() {
    try {
      for (int i = 1; i < 10000; i++) {
        ball.move();

        System.out.println("[BallThread] Thread name = "
            + Thread.currentThread().getName());

        Thread.sleep(5);
      }
    } catch (InterruptedException ex) {
    }
  }
}