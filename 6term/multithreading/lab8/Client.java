import java.io.*;
import java.net.*;
import java.util.InputMismatchException;
import java.util.Locale;
import java.util.Scanner;

public class Client {
  private static final int maxPrintSize = 8;
  private static final Timer timer = new Timer();

  public static void main(String[] args) {
    Locale.setDefault(Locale.US);

    if (args.length < 2) {
      System.err.println("Usage: java Client <server_host> <server_port>");
      System.exit(1);
    }

    final String HOST = args[0];
    final int PORT = Integer.parseInt(args[1]);

    try (
        Socket socket = new Socket(HOST, PORT);
        ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
        ObjectInputStream in = new ObjectInputStream(socket.getInputStream());
        Scanner scanner = new Scanner(System.in);) {

      String clientId = in.readUTF();
      System.out.println("Connected to server with id '" + clientId + "'");

      while (true) {
        System.out.println("Choose an option:");
        System.out.println("1. Send two matrices and receive their product");
        System.out.println("2. Send size of matrices and receive matrices and their product");
        System.out.println("0. Exit");
        System.out.print("Option: ");

        int option = 0;

        try {
          option = scanner.nextInt();
        } catch (InputMismatchException e) {
          System.err.println("Invalid input. Please enter a valid option (a number).");
          continue;
        } finally {
          scanner.nextLine();
        }

        switch (option) {
          case 1:
            handleClientGenerated(out, in, scanner);
            break;

          case 2:
            handleServerGenerated(out, in, scanner);
            break;

          case 0:
            return;

          default:
            System.err.println("Invalid option. Please try again.");
            break;
        }
      }
    } catch (IOException | ClassNotFoundException e) {
      e.printStackTrace();
    }
  }

  private static void handleClientGenerated(ObjectOutputStream out, ObjectInputStream in, Scanner scanner)
      throws IOException, ClassNotFoundException {
    sendRequest(out, "/multiply-client-generated");

    System.out.print("Enter size of matrices: ");
    int size = scanner.nextInt();
    scanner.nextLine();

    timer.start("client-generated");
    timer.start("client-generated:create-matrices");

    // Matrix a = new Matrix(size).fill(5.0);
    // Matrix b = new Matrix(size).fill(5.0);
    Matrix a = new Matrix(size).randomize();
    Matrix b = new Matrix(size).randomize();

    timer.end("client-generated:create-matrices");

    timer.start("client-generated:send-matrices");

    out.writeObject(a);
    out.writeObject(b);
    out.flush();

    timer.end("client-generated:send-matrices");

    timer.start("client-generated:receive-product");

    Matrix result = (Matrix) in.readObject();

    timer.end("client-generated:receive-product");
    timer.end("client-generated");

    System.out.println("Multiplied matrix:");
    result.print(maxPrintSize);

    System.out.println("\nTime report for [client-generated]:");
    System.out.printf("  Matrices created: %d ms\n", timer.get("client-generated:create-matrices"));
    System.out.printf("  Matrices sent: %d ms\n", timer.get("client-generated:send-matrices"));
    System.out.printf("  Product received: %d ms\n", timer.get("client-generated:receive-product"));
    System.out.printf("Total time: %d ms\n\n", timer.get("client-generated"));
  }

  private static void handleServerGenerated(ObjectOutputStream out, ObjectInputStream in, Scanner scanner)
      throws IOException, ClassNotFoundException {
    sendRequest(out, "/multiply-server-generated");

    System.out.print("Enter size of matrices: ");
    int size = scanner.nextInt();
    scanner.nextLine();

    timer.start("server-generated");
    timer.start("server-generated:send-size");

    out.writeInt(size);
    out.flush();

    timer.end("server-generated:send-size");

    timer.start("server-generated:receive-matrices");

    Matrix a = (Matrix) in.readObject();
    Matrix b = (Matrix) in.readObject();
    Matrix result = (Matrix) in.readObject();

    timer.end("server-generated:receive-matrices");
    timer.end("server-generated");

    System.out.println("Server-generated left matrix:");
    a.print(maxPrintSize);
    System.out.println("Server-generated right matrix:");
    b.print(maxPrintSize);
    System.out.println("Multiplied matrix:");
    result.print(maxPrintSize);

    System.out.println("\nTime report for [server-generated]:");
    System.out.printf("  Size sent: %d ms\n", timer.get("server-generated:send-size"));
    System.out.printf("  Matrices received: %d ms\n", timer.get("server-generated:receive-matrices"));
    System.out.printf("Total time: %d ms\n\n", timer.get("server-generated"));
  }

  private static void sendRequest(ObjectOutputStream out, String endpoint) throws IOException {
    out.writeUTF(endpoint);
    out.flush();
  }
}
