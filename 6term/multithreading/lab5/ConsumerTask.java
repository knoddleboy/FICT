import java.util.Random;

public class ConsumerTask implements Runnable {
  private final Random rand = new Random();
  private final Queue queue;
  private final double avgProcessTime;
  private boolean isStopped;
  private int processedCount;

  public ConsumerTask(Queue queue, double avgProcessTime) {
    this.queue = queue;
    this.avgProcessTime = avgProcessTime;
    isStopped = false;
    processedCount = 0;
  }

  public int getProcessedCount() {
    return processedCount;
  }

  public void stop() {
    isStopped = true;
  }

  @Override
  public void run() {
    try {
      while (!Thread.interrupted() && !isStopped) {
        queue.take();
        long processingTime = (long) Math.abs(rand.nextGaussian() + avgProcessTime);
        Thread.sleep(processingTime);
        processedCount++;
      }
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
