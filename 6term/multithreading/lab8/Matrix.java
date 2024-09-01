import java.io.Serializable;
import java.util.Locale;
import java.util.Random;

public class Matrix implements Serializable {
  private double[][] data;
  private final int rows;
  private final int cols;

  public Matrix(int size) {
    this.rows = size;
    this.cols = size;
    this.data = new double[size][size];
  }

  public Matrix(int rows, int cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = new double[rows][cols];
  }

  public int rows() {
    return rows;
  }

  public int cols() {
    return cols;
  }

  public double get(int i, int j) {
    return data[i][j];
  }

  public void set(int i, int j, double value) {
    data[i][j] = value;
  }

  public Matrix randomize() {
    Random rand = new Random();
    int min = -10;
    int max = 10;

    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < cols(); j++) {
        double value = min + (max - min) * rand.nextDouble();
        set(i, j, value);
      }
    }
    return this;
  }

  public Matrix fill(double value) {
    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < cols(); j++) {
        set(i, j, value);
      }
    }
    return this;
  }

  public Matrix add(Matrix other) {
    Matrix result = new Matrix(rows(), cols());

    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < cols(); j++) {
        double value = get(i, j) + other.get(i, j);
        result.set(i, j, value);
      }
    }

    return result;
  }

  public Matrix multiply(Matrix other) {
    Matrix result = new Matrix(rows(), other.cols());

    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < other.cols(); j++) {
        for (int k = 0; k < cols(); k++) {
          double newValue = result.get(i, j) + get(i, k) * other.get(k, j);
          result.set(i, j, newValue);
        }
      }
    }

    return result;
  }

  public Matrix[][] split(int nBlocks) {
    Matrix[][] blocks = new Matrix[nBlocks][nBlocks];

    int blockRows = (int) ((rows() - 1) / nBlocks) + 1;
    int blockCols = (int) ((cols() - 1) / nBlocks) + 1;

    for (int i = 0; i < nBlocks; i++) {
      for (int j = 0; j < nBlocks; j++) {
        blocks[i][j] = new Matrix(blockRows, blockCols);

        for (int k = 0; k < blockRows; k++) {
          for (int l = 0; l < blockCols; l++) {
            if (i * blockRows + k >= rows() || j * blockCols + l >= cols()) {
              blocks[i][j].set(k, l, 0);
            } else {
              double value = get(i * blockRows + k, j * blockCols + l);
              blocks[i][j].set(k, l, value);
            }
          }
        }
      }
    }

    return blocks;
  }

  public Matrix collect(Matrix[][] blocks) {
    for (int i = 0; i < blocks.length; i++) {
      for (int j = 0; j < blocks[i].length; j++) {
        Matrix block = blocks[i][j];

        for (int k = 0; k < block.rows(); k++) {
          for (int l = 0; l < block.cols(); l++) {
            if (i * block.rows() + k < rows() && j * block.cols() + l < cols()) {
              double blockValue = block.get(k, l);
              set(i * block.rows() + k, j * block.cols() + l, blockValue);
            }
          }
        }
      }
    }

    return this;
  }

  public boolean equals(Matrix other) {
    if (rows() != other.rows() || cols() != other.cols()) {
      return false;
    }

    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < cols(); j++) {
        if (Math.abs(get(i, j) - other.get(i, j)) > 1e-8) {
          return false;
        }
      }
    }

    return true;
  }

  public void print() {
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        printFormattedValue(get(i, j));
      }
      System.out.println();
    }
  }

  public void print(int limit) {
    int nLastRows = 2;
    int nLastCols = 2;

    int minLimitRows = rows() <= limit ? rows() : limit - nLastRows;
    int minLimitCols = cols() <= limit ? cols() : limit - nLastCols;

    for (int i = 0; i < minLimitRows; i++) {
      for (int j = 0; j < minLimitCols; j++) {
        printFormattedValue(get(i, j));
      }
      if (cols() > limit) {
        System.out.print(" ... ");
        for (int j = cols() - nLastCols; j < cols(); j++) {
          printFormattedValue(get(i, j));
        }
      }
      System.out.println();
    }

    if (rows() <= limit) {
      return;
    }

    for (int i = 0; i < limit - nLastCols; i++) {
      System.out.printf("%10s", "...");
    }
    System.out.print(" ... ");
    for (int i = cols() - nLastCols; i < cols(); i++) {
      System.out.printf("%10s", "...");
    }
    System.out.println();

    for (int i = rows() - nLastRows; i < rows(); i++) {
      for (int j = 0; j < limit - nLastCols; j++) {
        printFormattedValue(get(i, j));
      }
      System.out.print(" ... ");
      for (int j = cols() - nLastCols; j < cols(); j++) {
        printFormattedValue(get(i, j));
      }
      System.out.println();
    }
  }

  private void printFormattedValue(double value) {
    if (value == (int) value) {
      System.out.printf(Locale.US, "%10.1f", value);
    } else {
      System.out.printf(Locale.US, "%10.4f", value);
    }
  }
}
