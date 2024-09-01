import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class Text implements Iterable<String> {
  private final String fileName;
  private final List<String> lines;

  public Text(File file) {
    fileName = file.getName();
    lines = fromFile(file);
  }

  public Text(List<String> lines) {
    fileName = null;
    this.lines = lines;
  }

  private List<String> fromFile(File file) {
    List<String> lines = new LinkedList<>();

    try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
      String line;
      while ((line = reader.readLine()) != null) {
        lines.add(line);
      }
    } catch (IOException e) {
    }

    return lines;
  }

  List<String> getLines() {
    return lines;
  }

  String getName() {
    return fileName;
  }

  @Override
  public Iterator<String> iterator() {
    return lines.iterator();
  }
}
