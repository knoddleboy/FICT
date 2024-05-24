import javax.swing.JFrame;

public class Main {
  public static void main(String[] args) {
    BounceFrame frame = new BounceFrame();
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

    frame.setVisible(true);
    System.out.println("[Main] Thread name = " +
        Thread.currentThread().getName());
  }
}
