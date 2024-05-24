import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

public class BounceFrame extends JFrame {
  public static final int WIDTH = 450;
  public static final int HEIGHT = 350;

  private BallCanvas canvas;

  public BounceFrame() {
    this.setSize(WIDTH, HEIGHT);
    this.setTitle("Bounce balls");
    this.canvas = new BallCanvas();

    Container content = this.getContentPane();
    content.add(this.canvas, BorderLayout.CENTER);

    JPanel buttonPanel = new JPanel();
    buttonPanel.setBackground(Color.lightGray);

    JButton buttonAddBalls = new JButton("Add balls");
    JButton buttonStop = new JButton("Stop");

    createHoles();

    buttonAddBalls.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        createBalls(8);
      }
    });

    buttonStop.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        System.exit(0);
      }
    });

    buttonPanel.add(buttonAddBalls);
    buttonPanel.add(buttonStop);

    content.add(buttonPanel, BorderLayout.SOUTH);
  }

  private void createHoles() {
    int bottomPanelHeight = 67;
    canvas.addHole(new Hole(0, 0));
    canvas.addHole(new Hole(WIDTH - Hole.HOLE_SIZE, 0));
    canvas.addHole(new Hole(0, HEIGHT - Hole.HOLE_SIZE - bottomPanelHeight));
    canvas.addHole(new Hole(
        WIDTH - Hole.HOLE_SIZE,
        HEIGHT - Hole.HOLE_SIZE - bottomPanelHeight));
  }

  private void createBalls(int n) {
    ArrayList<BallThread> ballThreads = new ArrayList<>();

    for (int i = 0; i < n; i++) {
      int rgb = Color.HSBtoRGB((float) Math.random(), (float) 0.5, (float) 0.5);
      Color color = new Color(rgb);

      Ball ball = new Ball(canvas, color);
      canvas.addBall(ball);

      BallThread ballThread = i > 0
          ? new BallThreadJoin(ball, ballThreads.get(i - 1))
          : new BallThread(ball);
      ballThreads.add(ballThread);

      ballThread.start();
    }
  }
}