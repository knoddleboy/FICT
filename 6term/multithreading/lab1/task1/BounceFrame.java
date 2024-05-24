import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

class BounceFrame extends JFrame {
  private BallCanvas canvas;
  public static final int WIDTH = 450;
  public static final int HEIGHT = 350;

  public BounceFrame() {
    this.setSize(WIDTH, HEIGHT);
    this.setTitle("Bounce balls");
    this.canvas = new BallCanvas();

    System.out.println("[BounceFrame] In Frame Thread name = "
        + Thread.currentThread().getName());

    Container content = this.getContentPane();
    content.add(this.canvas, BorderLayout.CENTER);

    JPanel buttonPanel = new JPanel();
    buttonPanel.setBackground(Color.lightGray);

    JButton buttonStart = new JButton("Start");
    JButton buttonStop = new JButton("Stop");

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

  private void createBalls(int n) {
    for (int i = 0; i < n; i++) {
      Ball ball = new Ball(canvas);
      canvas.add(ball);

      BallThread ballThread = new BallThread(ball);
      ballThread.start();

      System.out.println("[BounceFrame] Thread name = "
          + ballThread.getName());
    }
  }
}