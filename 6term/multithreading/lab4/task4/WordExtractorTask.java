import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;

public class WordExtractorTask extends RecursiveTask<HashSet<String>> {
  private final Text text;

  public WordExtractorTask(Text text) {
    this.text = text;
  }

  @Override
  protected HashSet<String> compute() {
    if (text.getLines().size() > 100) {
      return mergeResults(ForkJoinTask.invokeAll(createSubtasks()).stream().map(ForkJoinTask::join).toList());
    }

    return WordExtractor.extractUnique(text);
  }

  private List<WordExtractorTask> createSubtasks() {
    List<String> lines = text.getLines();
    List<WordExtractorTask> tasks = new ArrayList<>();

    tasks.add(new WordExtractorTask(new Text(lines.subList(0, lines.size() / 2))));
    tasks.add(new WordExtractorTask(new Text(lines.subList(lines.size() / 2, lines.size()))));

    return tasks;
  }

  private HashSet<String> mergeResults(List<HashSet<String>> taskResults) {
    HashSet<String> merged = new HashSet<>();

    for (HashSet<String> wordSet : taskResults) {
      merged.addAll(wordSet);
    }

    return merged;
  }
}
