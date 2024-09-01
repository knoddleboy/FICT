public class Journal {
  private Group[] groups;

  public Journal(Group[] groups) {
    this.groups = groups;
  }

  public Group[] getGroups() {
    return groups;
  }

  public void display() {
    for (Group group : groups) {
      System.out.println("Group " + (group.getIndex() + 1));

      for (Student student : group.getStudents()) {
        System.out.print(String.format("Student %d:", student.getIndex() + 1));

        int count = 0;
        for (int grade : student.getGrades()) {
          System.out.print(String.format("%3d", grade));
          count++;
        }

        System.out.println("\nTotal: " + count);
      }
      System.out.println();
    }
  }
}
