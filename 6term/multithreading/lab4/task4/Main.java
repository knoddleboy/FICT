import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ForkJoinPool;

public class Main {
  public static void main(String[] args) throws IOException {
    String[] textFiles = { "./1984.txt", "./farm.txt", "./advs.txt" };
    List<Text> texts = new ArrayList<>();

    for (String textFile : textFiles) {
      texts.add(new Text(new File(textFile)));
    }

    String[] words = {
        "whirling",
        "talker",
        "and",
        "welcome",
        "definitely",
        "1984",
        "dead",
        "provinces",
        "habits",
        "chemical"
    };

    ForkJoinPool pool = new ForkJoinPool();

    for (Text text : texts) {
      long startTime = System.currentTimeMillis();
      HashSet<String> map = pool.invoke(new WordExtractorTask(text));
      map.retainAll(Arrays.stream(words).toList());
      long elapsedTime = System.currentTimeMillis() - startTime;

      System.out.println(text.getName() + ":\t" + map);
      System.out.println("Elapsed:\t" + elapsedTime + " ms\n");
    }
  }
}
