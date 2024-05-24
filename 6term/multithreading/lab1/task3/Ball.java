import java.awt.*;
import java.awt.geom.Ellipse2D;

public class Ball {
  private static final int XSIZE = 20;
  private static final int YSIZE = 20;

  private Component canvas;
  private int x = 0;
  private int y = 0;
  private int dx = 2;
  private int dy = 2;
  private Color color;

  public Ball(Component c, Color color) {
    this.canvas = c;
    this.color = color;
    this.x = canvas.getWidth() / 2;
    this.y = canvas.getHeight() / 2;
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
}