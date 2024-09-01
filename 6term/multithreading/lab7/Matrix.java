import java.util.Locale;
import java.util.Random;

public class Matrix {
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

  public Matrix(double[] reduced, int rows, int cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = new double[rows][cols];

    int index = 0;
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < cols; j++) {
        set(i, j, reduced[index++]);
      }
    }
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

  public Matrix subMatrix(int startRow, int endRow, int nCols) {
    Matrix subMatrix = new Matrix(endRow - startRow + 1, nCols);

    for (int i = startRow; i <= endRow; i++) {
      for (int j = 0; j < nCols; j++) {
        subMatrix.set(i - startRow, j, get(i, j));
      }
    }

    return subMatrix;
  }

  public double[] reduce() {
    double[] array = new double[rows() * cols()];
    int index = 0;

    for (int i = 0; i < rows(); i++) {
      for (int j = 0; j < cols(); j++) {
        array[index] = get(i, j);
        index++;
      }
    }

    return array;
  }

  public void replaceBlock(Matrix block, int startRow, int endRow, int nCols) {
    for (int i = startRow; i <= endRow; i++) {
      for (int j = 0; j < nCols; j++) {
        set(i, j, block.get(i - startRow, j));
      }
    }
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
        System.out.printf(Locale.US, "%10.4f", get(i, j));
      }
      System.out.println();
    }
  }
}
