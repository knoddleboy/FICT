import java.io.*;
import java.net.*;
import java.util.concurrent.atomic.AtomicInteger;

public class Server {
  private static final AtomicInteger clientIdCounter = new AtomicInteger(0);

  public static void main(String[] args) {
    if (args.length < 1) {
      System.err.println("Usage: java Server <port>");
      System.exit(1);
    }

    final int PORT = Integer.parseInt(args[0]);

    try (ServerSocket serverSocket = new ServerSocket(PORT)) {
      System.out.println("Server started on port " + PORT);

      while (true) {
        Socket clientSocket = serverSocket.accept();
        String clientId = generateClientId();
        System.out.printf("Client '%s' connected: %s\n", clientId, clientSocket);

        ClientHandler clientHandler = new ClientHandler(clientSocket, clientId);
        new Thread(clientHandler).start();
      }
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static String generateClientId() {
    return "Client-" + clientIdCounter.incrementAndGet();
  }
}

class ClientHandler implements Runnable {
  private static final int nThreads = 4;
  private static final int maxPrintSize = 8;

  private final FoxFJP fox = new FoxFJP(nThreads);
  private final Timer timer = new Timer();

  private final Socket clientSocket;
  private final String clientId;

  public ClientHandler(Socket clienSocket, String clientId) {
    this.clientSocket = clienSocket;
    this.clientId = clientId;
  }

  @Override
  public void run() {
    try (
        ObjectInputStream in = new ObjectInputStream(clientSocket.getInputStream());
        ObjectOutputStream out = new ObjectOutputStream(clientSocket.getOutputStream());) {

      out.writeUTF(clientId);
      out.flush();

      while (true) {
        try {
          String request = in.readUTF();
          System.out.printf("[%s] Received request: %s\n", clientId, request);

          switch (request) {
            case "/multiply-client-generated":
              handleClientGenerated(out, in);
              break;

            case "/multiply-server-generated":
              handleServerGenerated(out, in);
              break;

            default:
              out.writeUTF("Invalid endpoint");
              out.flush();
              break;
          }
        } catch (EOFException e) {
          System.out.printf("Client '%s' disconnected: %s\n", clientId, clientSocket);
          return;
        }
      }

    } catch (IOException | ClassNotFoundException e) {
      e.printStackTrace();
    }
  }

  private void handleClientGenerated(ObjectOutputStream out, ObjectInputStream in)
      throws IOException, ClassNotFoundException {
    timer.start("server:client-generated:receive-matrices");

    Matrix a = (Matrix) in.readObject();
    Matrix b = (Matrix) in.readObject();

    timer.end("server:client-generated:receive-matrices");

    System.out.printf("[%s] Matrices received: %d ms\n", clientId,
        timer.get("server:client-generated:receive-matrices"));

    System.out.printf("[%s] Received left matrix:\n", clientId);
    a.print(maxPrintSize);
    System.out.printf("[%s] Received right matrix:\n", clientId);
    b.print(maxPrintSize);

    timer.start("server:client-generated:multiply-matrices");

    Matrix result = fox.multiply(a, b);

    timer.end("server:client-generated:multiply-matrices");

    System.out.printf("[%s] Matrices multiplied: %d ms\n", clientId,
        timer.get("server:client-generated:multiply-matrices"));

    out.writeObject(result);
    out.flush();
  }

  private void handleServerGenerated(ObjectOutputStream out, ObjectInputStream in)
      throws IOException, ClassNotFoundException {
    int size = in.readInt();
    System.out.printf("[%s] Received matrices size: %d\n", clientId, size);

    timer.start("server:server-generated:create-matrices");

    Matrix a = new Matrix(size).randomize();
    Matrix b = new Matrix(size).randomize();

    timer.end("server:server-generated:create-matrices");

    System.out.printf("[%s] Matrices created: %d ms\n", clientId,
        timer.get("server:server-generated:create-matrices"));

    timer.start("server:server-generated:multiply-matrices");
    Matrix result = fox.multiply(a, b);
    timer.end("server:server-generated:multiply-matrices");

    System.out.printf("[%s] Matrices multiplied: %d ms\n", clientId,
        timer.get("server:server-generated:multiply-matrices"));

    timer.start("server:server-generated:send-matrices");

    out.writeObject(a);
    out.writeObject(b);
    out.writeObject(result);
    out.flush();

    timer.end("server:server-generated:send-matrices");

    System.out.printf("[%s] Matrices sent: %d ms\n", clientId,
        timer.get("server:server-generated:send-matrices"));
  }
}
