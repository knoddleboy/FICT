import java.util.ArrayList;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MassSystem implements Callable<ArrayList<Float>> {
  private final int systemIndex;
  private final int nChannels = 9;
  private final int queueCap = 200;
  private final double avgProduceTime = 5;
  private final double avgProcessTime = 50;
  private final long measurePeriod = 500;

  public MassSystem(int systemIndex) {
    this.systemIndex = systemIndex;
  }

  @Override
  public ArrayList<Float> call() throws Exception {
    try {
      ExecutorService executor = Executors.newFixedThreadPool(nChannels + 1);
      Queue queue = new Queue(queueCap);

      ProducerTask producerTask = new ProducerTask(queue, avgProduceTime);
      executor.execute(producerTask);

      ConsumerTask[] consumerTasks = new ConsumerTask[nChannels];
      for (int i = 0; i < nChannels; i++) {
        consumerTasks[i] = new ConsumerTask(queue, avgProcessTime);
        executor.execute(consumerTasks[i]);
      }

      Stats stats = new Stats(queue, measurePeriod);
      stats.start();

      Thread.sleep(10000);

      executor.shutdown();
      producerTask.stop();
      for (ConsumerTask consumerTask : consumerTasks) {
        consumerTask.stop();
      }
      stats.interrupt();

      int nProcessed = 0;
      for (ConsumerTask consumerTask : consumerTasks) {
        nProcessed += consumerTask.getProcessedCount();
      }

      int nMeasures = stats.getMeasuresCount();
      int queueLengthSum = stats.getQueueLengthSum();
      int nProduced = queue.getReceivedCount();
      int nRejected = queue.getRejectedCount();

      float avgQueueLength = (float) queueLengthSum / nMeasures;
      float rejectionProb = (float) nRejected / nProduced;

      System.out.println(
          String.format("-- System #%d:\n", systemIndex) +
              String.format("Produced:\t%d\n", nProduced) +
              String.format("Processed:\t%d\n", nProcessed) +
              String.format("Rejected:\t%d\n", nRejected) +
              String.format("Avg queue len:\t%.3f\n", avgQueueLength) +
              String.format("Rejection prob:\t%f\n", rejectionProb));

      ArrayList<Float> imitationResultStats = new ArrayList<>();
      imitationResultStats.add(avgQueueLength);
      imitationResultStats.add(rejectionProb);

      return imitationResultStats;
    } catch (InterruptedException e) {
      System.out.println("Mass System #" + systemIndex + ":");
      e.printStackTrace();
    }

    return null;
  }
}
