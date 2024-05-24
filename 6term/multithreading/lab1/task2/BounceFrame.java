import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

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

    JButton buttonStart = new JButton("Start");
    JButton buttonStop = new JButton("Stop");

    createHoles();

    buttonStart.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        createBalls(5);
      }
    });

    buttonStop.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        System.exit(0);
      }
    });

    buttonPanel.add(buttonStart);
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
    for (int i = 0; i < n; i++) {
      Ball ball = new Ball(canvas);
      canvas.addBall(ball);

      BallThread ballThread = new BallThread(ball);
      ballThread.start();
    }
  }
}