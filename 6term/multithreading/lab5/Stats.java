public class Stats extends Thread {
  private final Queue queue;
  private final long measurePeriod;
  private int nMeasures;
  private int queueLengthSum;

  public Stats(Queue queue, long measurePeriod) {
    this.queue = queue;
    this.measurePeriod = measurePeriod;
    nMeasures = 0;
    queueLengthSum = 0;
  }

  public int getMeasuresCount() {
    return nMeasures;
  }

  public int getQueueLengthSum() {
    return queueLengthSum;
  }

  @Override
  public void run() {
    try {
      while (!Thread.interrupted()) {
        Thread.sleep(measurePeriod);
        nMeasures++;
        queueLengthSum += queue.getCount();
      }
    } catch (InterruptedException e) {
    }
  }
}
