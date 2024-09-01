import java.util.Random;

public class ProducerTask implements Runnable {
  private final Random rand = new Random();
  private final Queue queue;
  private final double avgProduceTime;
  private boolean isStopped;

  public ProducerTask(Queue queue, double avgProduceTime) {
    this.queue = queue;
    this.avgProduceTime = avgProduceTime;
    isStopped = false;
  }

  public void stop() {
    isStopped = true;
  }

  @Override
  public void run() {
    try {
      while (!Thread.interrupted() && !isStopped) {
        long producingTime = (long) Math.abs(rand.nextGaussian() + avgProduceTime);
        Thread.sleep(producingTime);
        queue.put(rand.nextInt(100));
      }
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
