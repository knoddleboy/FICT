import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;

public class WordCounterTask extends RecursiveTask<LengthsMap> {
  private final Text text;

  public WordCounterTask(Text text) {
    this.text = text;
  }

  @Override
  protected LengthsMap compute() {
    if (text.getLines().size() > 100) {
      return mergeResults(ForkJoinTask.invokeAll(createSubtasks()).stream().map(ForkJoinTask::join).toList());
    }

    return WordCounter.count(text);
  }

  private List<WordCounterTask> createSubtasks() {
    List<String> lines = text.getLines();
    List<WordCounterTask> tasks = new ArrayList<>();

    tasks.add(new WordCounterTask(new Text(lines.subList(0, lines.size() / 2))));
    tasks.add(new WordCounterTask(new Text(lines.subList(lines.size() / 2, lines.size()))));

    return tasks;
  }

  private LengthsMap mergeResults(List<LengthsMap> tasksResults) {
    LengthsMap merged = new LengthsMap();
    HashSet<Integer> lengths = new HashSet<>();

    for (LengthsMap lm : tasksResults) {
      lengths.addAll(lm.keySet());
    }

    for (Integer length : lengths) {
      merged.put(length, tasksResults.stream().mapToInt(lm -> lm.getOrDefault(length, 0)).sum());
    }

    return merged;
  }
}
