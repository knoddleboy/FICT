import java.awt.*;
import java.awt.geom.Ellipse2D;

class Hole {
  public static final int HOLE_SIZE = 40;

  private int x;
  private int y;

  public Hole(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public void draw(Graphics2D g2) {
    g2.setColor(Color.BLACK);
    g2.fill(new Ellipse2D.Double(x, y, HOLE_SIZE, HOLE_SIZE));
  }

  public boolean contains(Ball ball) {
    return ball.getX() >= x
        && ball.getX() <= x + HOLE_SIZE
        && ball.getY() >= y
        && ball.getY() <= y + HOLE_SIZE;
  }
}