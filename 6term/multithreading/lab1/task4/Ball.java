import java.awt.*;
import java.util.Random;
import java.awt.geom.Ellipse2D;

public class Ball {
  private static final int XSIZE = 20;
  private static final int YSIZE = 20;

  private BallCanvas canvas;
  private Color color;
  private int x = 0;
  private int y = 0;
  private int dx = 2;
  private int dy = 2;

  public Ball(BallCanvas c, Color color) {
    this.canvas = c;
    this.color = color;
    this.x = getRandomX();
    this.y = getRandomY();
  }

  public void draw(Graphics2D g2) {
    g2.setColor(color);
    g2.fill(new Ellipse2D.Double(x, y, XSIZE, YSIZE));
  }

  public void move() {
    x += dx;
    y += dy;

    if (x < 0) {
      x = 0;
      dx = -dx;
    }

    if (x + XSIZE >= this.canvas.getWidth()) {
      x = this.canvas.getWidth() - XSIZE;
      dx = -dx;
    }

    if (y < 0) {
      y = 0;
      dy = -dy;
    }

    if (y + YSIZE >= this.canvas.getHeight()) {
      y = this.canvas.getHeight() - YSIZE;
      dy = -dy;
    }

    this.canvas.repaint();
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public boolean isInHole() {
    return canvas.isInHole(this);
  }

  public void clear() {
    this.canvas.removeBall(this);
  }

  private int getRandomX() {
    int min = Hole.HOLE_SIZE;
    int max = this.canvas.getWidth() - Hole.HOLE_SIZE;
    return (new Random().nextInt(max - min)) + min;
  }

  private int getRandomY() {
    int min = Hole.HOLE_SIZE;
    int max = this.canvas.getHeight() - Hole.HOLE_SIZE;
    return (new Random().nextInt(max - min)) + min;
  }
}