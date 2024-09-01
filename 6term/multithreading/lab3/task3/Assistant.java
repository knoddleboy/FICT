public class Assistant extends Thread {
  private Group group;
  private int numWeeks;

  public Assistant(Group group, int numWeeks) {
    this.group = group;
    this.numWeeks = numWeeks;
  }

  @Override
  public void run() {
    for (Student student : group.getStudents()) {
      for (int i = 0; i < numWeeks; i++) {
        int grade = (int) (Math.random() * 100);
        student.addGrade(grade);
      }
    }
  }
}
