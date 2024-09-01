import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.concurrent.ForkJoinPool;

public class Main {
  public static void main(String[] args) throws IOException {
    File file1 = new File("./advs.txt");
    File file2 = new File("./farm.txt");

    Text text1 = new Text(file1);
    Text text2 = new Text(file2);

    ForkJoinPool pool = new ForkJoinPool();

    long startTime = System.currentTimeMillis();
    HashSet<String> set1 = pool.invoke(new WordExtractorTask(text1));
    HashSet<String> set2 = pool.invoke(new WordExtractorTask(text2));
    set1.retainAll(set2);
    long elapsedTime = System.currentTimeMillis() - startTime;

    System.out.println("Common words:\t" + set1.size());
    System.out.println("Elapsed:\t" + elapsedTime + " ms");
  }
}
