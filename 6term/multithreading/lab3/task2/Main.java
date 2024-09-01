public class Main {
  public static void main(String[] args) {
    Drop drop = new Drop(1000);
    (new Thread(new Producer(drop))).start();
    (new Thread(new Consumer(drop))).start();
  }
}
