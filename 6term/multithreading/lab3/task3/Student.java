import java.util.ArrayList;

public class Student {
  private int index;
  private ArrayList<Integer> grades = new ArrayList<>();

  public Student(int index) {
    this.index = index;
  }

  public int getIndex() {
    return index;
  }

  public synchronized void addGrade(int grade) {
    grades.add(grade);
  }

  public ArrayList<Integer> getGrades() {
    return grades;
  }
}
