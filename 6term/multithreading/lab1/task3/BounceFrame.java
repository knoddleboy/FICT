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

    JButton button50Blues = new JButton("50 blues");
    JButton button200Blues = new JButton("200 blues");
    JButton button500Blues = new JButton("500 blues");
    JButton buttonStop = new JButton("Stop");

    button50Blues.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        canvas.reset();
        createBalls(50, Color.BLUE, Thread.MIN_PRIORITY);
        createBalls(1, Color.RED, Thread.MAX_PRIORITY);
      }
    });

    button200Blues.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        canvas.reset();
        createBalls(200, Color.BLUE, Thread.MIN_PRIORITY);
        createBalls(1, Color.RED, Thread.MAX_PRIORITY);
      }
    });

    button500Blues.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        canvas.reset();
        createBalls(500, Color.BLUE, Thread.MIN_PRIORITY);
        createBalls(1, Color.RED, Thread.MAX_PRIORITY);
      }
    });

    buttonStop.addActionListener(new ActionListener() {
      @Override
      public void actionPerformed(ActionEvent e) {
        System.exit(0);
      }
    });

    buttonPanel.add(button50Blues);
    buttonPanel.add(button200Blues);
    buttonPanel.add(button500Blues);
    buttonPanel.add(buttonStop);

    content.add(buttonPanel, BorderLayout.SOUTH);
  }

  private void createBalls(int n, Color color, int priority) {
    for (int i = 0; i < n; i++) {
      Ball ball = new Ball(canvas, color);
      BallThread ballThread = new BallThread(ball, priority);
      canvas.addThread(ballThread);

      ballThread.start();
    }
  }
}