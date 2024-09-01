public class Matrix {
  public int[][] matrix;
  public final int rows;
  public final int cols;

  public Matrix(int size) {
    this.matrix = new int[size][size];
    this.rows = size;
    this.cols = size;
  }

  public Matrix(int rows, int cols) {
    this.matrix = new int[rows][cols];
    this.rows = rows;
    this.cols = cols;
  }

  public int[][] getBlock(int rowDiv, int colDiv, int rowIndex, int colIndex) {
    int nRows = (int) Math.ceil(rows / rowDiv);
    int nCols = (int) Math.ceil(cols / colDiv);
    int[][] block = new int[nRows][nCols];

    for (int i = 0; i < nRows; i++) {
      for (int j = 0; j < nCols; j++) {
        int row = rowIndex * nRows + i;
        int col = colIndex * nCols + j;

        block[i][j] = matrix[row][col];
      }
    }

    return block;
  }

  public int[][] getRows(int startRow, int numRows) {
    return getBlock(numRows, 1, startRow, 0);
  }

  public int[][] getCols(int startCol, int numCols) {
    return getBlock(1, numCols, 0, startCol);
  }

  public synchronized void write(int[][] block, int rowOffset, int colOffset, int factor) {
    for (int i = 0; i < block.length; i++) {
      int rowIndex = rowOffset * rows / factor + i;

      for (int j = 0; j < block[0].length; j++) {
        int colIndex = colOffset * cols / factor + j;
        matrix[rowIndex][colIndex] = block[i][j];
      }
    }
  }

  public static void add(int[][] A, int[][] B) {
    for (int i = 0; i < A.length; i++) {
      for (int j = 0; j < A[0].length; j++) {
        A[i][j] += B[i][j];
      }
    }
  }

  public static int[][] multiply(int[][] A, int[][] B) {
    int rowsA = A.length;
    int colsA = A[0].length;
    int colsB = B[0].length;

    int[][] C = new int[rowsA][colsB];

    for (int i = 0; i < rowsA; i++) {
      for (int j = 0; j < colsB; j++) {
        for (int k = 0; k < colsA; k++) {
          C[i][j] += A[i][k] * B[k][j];
        }
      }
    }

    return C;
  }

  public static Matrix multiply(Matrix A, Matrix B) {
    int rowsA = A.rows;
    int colsA = B.cols;
    int colsB = B.cols;

    Matrix C = new Matrix(rowsA, colsB);

    for (int i = 0; i < rowsA; i++) {
      for (int j = 0; j < colsB; j++) {
        for (int k = 0; k < colsA; k++) {
          C.matrix[i][j] += A.matrix[i][k] * B.matrix[k][j];
        }
      }
    }

    return C;
  }

  public static void multiply(Matrix A, Matrix B, Matrix C) {
    int rowsA = A.rows;
    int colsA = B.cols;
    int colsB = B.cols;

    for (int i = 0; i < rowsA; i++) {
      for (int j = 0; j < colsB; j++) {
        for (int k = 0; k < colsA; k++) {
          C.matrix[i][j] += A.matrix[i][k] * B.matrix[k][j];
        }
      }
    }
  }

  public Matrix generateAllOnes() {
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        matrix[i][j] = 1;
      }
    }

    return this;
  }

  public static boolean isCorrectAllOnesProduct(Matrix matrix, int colsAOrRowsB) {
    for (int i = 0; i < matrix.rows; i++) {
      for (int j = 0; j < matrix.cols; j++) {
        if (matrix.matrix[i][j] != colsAOrRowsB) {
          return false;
        }
      }
    }

    return true;
  }

  public void print() {
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        // System.out.printf("%10.1f", matrix[i][j]);
        System.out.print(matrix[i][j] + " ");
      }
      System.out.println();
    }
  }
}