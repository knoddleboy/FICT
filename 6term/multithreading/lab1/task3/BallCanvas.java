import javax.swing.*;
import java.util.ArrayList;
import java.awt.*;

public class BallCanvas extends JPanel {
  private ArrayList<BallThread> threads = new ArrayList<>();

  public void reset() {
    for (BallThread thread : threads) {
      thread.interrupt();
    }

    threads.clear();
    repaint();
  }

  public void addThread(BallThread thread) {
    threads.add(thread);
  }

  @Override
  public void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g;

    for (int i = 0; i < threads.size(); i++) {
      Ball ball = threads.get(i).getBall();
      ball.draw(g2);
    }
  }
}