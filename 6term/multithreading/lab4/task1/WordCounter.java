public class WordCounter {
  public static String[] wordsFrom(String line) {
    return line.trim().split("(\\s|\\p{Punct})+");
  }

  public static LengthsMap count(Text text) {
    LengthsMap lengthsMap = new LengthsMap();

    for (String line : text) {
      for (String word : wordsFrom(line)) {
        int length = word.length();

        if (!lengthsMap.containsKey(length)) {
          lengthsMap.put(length, 1);
        } else {
          lengthsMap.put(length, lengthsMap.get(length) + 1);
        }
      }
    }

    return lengthsMap;
  }
}
