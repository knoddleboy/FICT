public class Group {
  private int index;
  private Student[] students;

  public Group(int index, Student[] students) {
    this.index = index;
    this.students = students;
  }

  public int getIndex() {
    return index;
  }

  public Student[] getStudents() {
    return students;
  }
}
