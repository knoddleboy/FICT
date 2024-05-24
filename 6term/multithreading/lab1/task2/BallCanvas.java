import javax.swing.*;
import java.util.ArrayList;
import java.awt.*;

public class BallCanvas extends JPanel {
  private ArrayList<Ball> balls = new ArrayList<>();
  private ArrayList<Hole> holes = new ArrayList<>();

  public void addBall(Ball ball) {
    this.balls.add(ball);
  }

  public void removeBall(Ball ball) {
    this.balls.remove(ball);
    repaint();
  }

  public void addHole(Hole hole) {
    this.holes.add(hole);
  }

  @Override
  public void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g;

    for (int i = 0; i < holes.size(); i++) {
      holes.get(i).draw(g2);
    }

    for (int i = 0; i < balls.size(); i++) {
      balls.get(i).draw(g2);
    }

    g2.setColor(Color.BLACK);
    g2.drawString("Fallen balls: "
        + HitsCounter.getInstance().getHits(), 50, 20);
  }

  public boolean isInHole(Ball ball) {
    boolean inHole = false;

    for (Hole hole : holes) {
      inHole |= hole.contains(ball);
    }

    return inHole;
  }
}