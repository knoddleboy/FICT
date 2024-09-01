public class Main {
  public static void main(String[] args) throws InterruptedException {
    int numGroups = 3;
    int studentsPerGroup = 10;
    int numWeeks = 20;

    Group[] groups = new Group[numGroups];
    Assistant[] assistants = new Assistant[numGroups];

    for (int i = 0; i < numGroups; i++) {
      Student[] students = new Student[studentsPerGroup];
      for (int j = 0; j < studentsPerGroup; j++) {
        students[j] = new Student(j);
      }

      Group group = new Group(i, students);
      groups[i] = group;
      assistants[i] = new Assistant(group, numWeeks);
    }

    Journal journal = new Journal(groups);
    Lecturer lecturer = new Lecturer(journal, numWeeks);

    lecturer.start();
    for (Assistant assistant : assistants) {
      assistant.start();
    }

    lecturer.join();
    for (Assistant assistant : assistants) {
      assistant.join();
    }

    journal.display();
  }
}
