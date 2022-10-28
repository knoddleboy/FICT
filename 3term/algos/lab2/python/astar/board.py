from typing import Literal, Optional
from random import randint
from copy import deepcopy
from helpers.logger import NQLogger


class Board:
    def __init__(self, queens: Optional[int] = None, other=None) -> None:
        self.size: int
        self.matrix: list[list[Literal[0, 1]]]

        if other:
            # debug: initial board
            if isinstance(other, Board):
                self.size = other.size
                self.matrix = deepcopy(other.matrix)

            elif isinstance(other, list):
                self.size = len(other)
                self.matrix = other

        # create empty board
        else:
            self.size = queens or 4
            self.matrix = [[0 for i in range(self.size)] for j in range(self.size)]

        self.conf = self.conflict_number()

    def generate_board(self):
        # populate with random Q placement
        for i in range(self.size):
            j = randint(0, self.size - 1)
            self.matrix[i][j] = 1

    def conflict_number(self):
        raw_pairs = set()
        for i in range(self.size):
            for j in range(self.size):
                if self.matrix[i][j] == 1:
                    self.get_conflict(i, j, raw_pairs)

        # eliminate repeated pairs
        pairs = set()
        for pair in raw_pairs:
            rev = tuple(reversed(pair))
            if rev not in pairs:
                pairs.add(pair)

        # return the number of pairs as a conflicts number
        return len(pairs)

    def correct_index(self, i, j):
        return i >= 0 and i < self.size and j >= 0 and j < self.size

    def get_conflict(self, i, j, seen_pairs: set):

        # Horizontal conflict before Qi
        # |  | Q |  |  | Q |  |
        #      ^         i
        for col in range(abs(j - 1), 0):
            if self.matrix[i][col] == 1:
                seen_pairs.add(((i, j), (i, col)))
                seen_pairs.add(((i, col), (i, j)))
                break

        # Horizontal conflict after Qi
        # |  | Q |  |  | Q |  |
        #      i         ^
        for col in range(j + 1, self.size):
            if self.matrix[i][col] == 1:
                seen_pairs.add(((i, j), (i, col)))
                seen_pairs.add(((i, col), (i, j)))
                break

        # Vertical conflict before Qj
        # |   | Q <   |
        # |   |   |   |
        # |   | Q j   |
        for row in range(abs(i - 1), 0):
            if self.matrix[row][j] == 1:
                seen_pairs.add(((i, j), (row, j)))
                seen_pairs.add(((row, j), (i, j)))
                break

        # Vertical conflict after Qj
        # |   | Q j   |
        # |   |   |   |
        # |   | Q <   |
        for row in range(i + 1, self.size):
            if self.matrix[row][j] == 1:
                seen_pairs.add(((i, j), (row, j)))
                seen_pairs.add(((row, j), (i, j)))
                break

        row = i - 1
        col = j - 1

        # Left-Up diagonal conflict
        # | Q <   |   |
        # |   | . |   |
        # |   |   | Q row,col
        while self.correct_index(row, col):
            if self.matrix[row][col] == 1:
                seen_pairs.add(((i, j), (row, col)))
                seen_pairs.add(((row, col), (i, j)))
                break

            row -= 1
            col -= 1

        row = i + 1
        col = j + 1

        # Right-Down diagonal conflict
        # | Q row,col |
        # |   | . |   |
        # |   |   | Q <
        while self.correct_index(row, col):
            if self.matrix[row][col] == 1:
                seen_pairs.add(((i, j), (row, col)))
                seen_pairs.add(((row, col), (i, j)))
                break

            row += 1
            col += 1

        row = i - 1
        col = j + 1

        # Up-Right diagonal conflict
        # |   |   | Q row,col
        # |   | . |   |
        # | Q <   |   |
        while self.correct_index(row, col):
            if self.matrix[row][col] == 1:
                seen_pairs.add(((i, j), (row, col)))
                seen_pairs.add(((row, col), (i, j)))
                break

            row -= 1
            col += 1

        row = i + 1
        col = j - 1

        # Left-Down diagonal conflict
        # |   |   | Q <
        # |   | . |   |
        # | Q row,col |
        while self.correct_index(row, col):
            if self.matrix[row][col] == 1:
                seen_pairs.add(((i, j), (row, col)))
                seen_pairs.add(((row, col), (i, j)))
                break

            row += 1
            col -= 1

    def move_figure(self, row: int, shift: int):
        # for logging
        new_row = 0
        new_col = 0
        last_j = 0

        for j in range(self.size):
            if self.matrix[row][j] == 1:
                self.matrix[row][j] = 0

                col = j + shift
                if col >= self.size:
                    col -= self.size

                self.matrix[row][col] = 1

                # for logging
                [new_row, new_col, last_j] = [row, col, j]
                break

        self.conf = self.conflict_number()

        # log the move
        NQLogger.info(f"Move Q: ({row},{last_j}) -> ({new_row},{new_col})  ::  {self.conf} conflicts after moving")

    def print(self, pre: str | None = None, end: str | None = '\n') -> None:
        if pre:
            print(pre)

        def print_black_cell(q: Literal['Q', ' ']) -> None:
            print(f"\033[100m \033[97m{q} \033[0m", end="")

        def print_white_cell(q: Literal['Q', ' ']) -> None:
            print(f'\033[47m \033[30m{q} \033[0m', end="")

        for i in range(len(self.matrix)):
            print("|", end="")

            for j in range(len(self.matrix[i])):
                q = 'Q' if self.matrix[i][j] == 1 else ' '

                if (i % 2 == 0):
                    if (j % 2 == 0):
                        print_white_cell(q)
                    else:
                        print_black_cell(q)

                else:
                    if (j % 2 == 0):
                        print_black_cell(q)
                    else:
                        print_white_cell(q)

            print("|")
        print(end, end='')
