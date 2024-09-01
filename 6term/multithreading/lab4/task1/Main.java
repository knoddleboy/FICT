import java.io.File;
import java.io.IOException;
import java.util.Locale;
import java.util.concurrent.ForkJoinPool;

public class Main {
  public static void main(String[] args) throws IOException {
    Locale.setDefault(Locale.US);

    Text text = new Text(new File("./1984.txt"));

    ForkJoinPool pool = new ForkJoinPool();

    long startTime = System.currentTimeMillis();
    LengthsMap lm = pool.invoke(new WordCounterTask(text));
    long elapsedTime = System.currentTimeMillis() - startTime;

    double totalLength = 0;
    int wordsCount = 0;

    for (var item : lm.entrySet()) {
      totalLength += (item.getKey() * item.getValue());
      wordsCount += item.getValue();
    }
    double avgLength = totalLength / (double) wordsCount;

    totalLength = 0;
    for (var item : lm.entrySet()) {
      totalLength += Math.pow(item.getKey(), 2) * item.getValue();
    }
    double deviation = Math.sqrt((totalLength / wordsCount) - Math.pow(avgLength, 2));

    System.out.println(
        String.format("Total words:\t%d\n", wordsCount) +
            String.format("Avg length:\t%.3f\n", avgLength) +
            String.format("Avg sq dev:\t%.3f\n", deviation) +
            String.format("Elapsed:\t%dms", elapsedTime));
  }
}
