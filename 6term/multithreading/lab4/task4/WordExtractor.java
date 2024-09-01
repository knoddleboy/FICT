import java.util.Arrays;
import java.util.HashSet;

public class WordExtractor {
  public static String[] wordsFrom(String line) {
    return line.trim().split("(\\s|\\p{Punct})+");
  }

  public static HashSet<String> extractUnique(Text text) {
    HashSet<String> uniqueWords = new HashSet<>();

    for (String line : text) {
      uniqueWords.addAll(Arrays.asList(wordsFrom(line)));
    }

    return uniqueWords;
  }
}
