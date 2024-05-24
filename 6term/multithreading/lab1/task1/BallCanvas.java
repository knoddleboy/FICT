import javax.swing.*;
import java.util.ArrayList;
import java.awt.*;

class BallCanvas extends JPanel {
  private ArrayList<Ball> balls = new ArrayList<>();

  public void add(Ball ball) {
    this.balls.add(ball);
  }

  @Override
  public void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g;

    for (int i = 0; i < balls.size(); i++) {
      Ball ball = balls.get(i);
      ball.draw(g2);
    }
  }
}