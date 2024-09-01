public class Lecturer extends Thread {
  private Journal journal;
  private int numWeeks;

  public Lecturer(Journal journal, int numWeeks) {
    this.journal = journal;
    this.numWeeks = numWeeks;
  }

  @Override
  public void run() {
    for (Group group : journal.getGroups()) {
      for (Student student : group.getStudents()) {
        for (int i = 0; i < numWeeks; i++) {
          int grade = (int) (Math.random() * 100);
          student.addGrade(grade);
        }
      }
    }
  }
}
