# Nov 12 - lab 2

"""
Problem: Place 8 queens on chessboard such that no two queens are in same row, column, and diagonal.
Solution: We will put the queens one by one in each column while satisfying the requried criteria. If such a queen can not be placed, we will backtrack until a valid configuration is possible.
Looking at the problem definition we know that two queens can not be in same column. Hence we will put each queen in the adjacent column to the previous placed one. We have to just find the suitable row while placing and mainting the constraint.
"""

from argparse import ArgumentParser, BooleanOptionalAction
from typing import Literal
from numpy import full

from functools import wraps
from time import time


def timer(f):
    @wraps(f)
    def wrap(*args, **kw):
        tstart = time()
        result = f(*args, **kw)
        tend = time()
        print(f"--- solved in {tend-tstart:.3f} sec ---")
        return result
    return wrap

# 0 = queen absent
# 1 = queen present


class NQueens:
    def __init__(self, queens: int, print_sols: bool) -> None:
        self.queens = queens
        self.print_sols = print_sols
        self.chess = full((queens, queens), 0)
        self.steps = 0
        self.total_steps = 0
        self.states = 0

    def _print_chess(self) -> None:

        def print_black_cell(q: Literal['Q', ' ']) -> None:
            print(f"\033[100m \033[97m{q} \033[0m", end="")

        def print_white_cell(q: Literal['Q', ' ']) -> None:
            print(f'\033[47m \033[30m{q} \033[0m', end="")

        for i in range(len(self.chess)):
            print("|", end="")

            for j in range(len(self.chess[i])):
                q = 'Q' if self.chess[i][j] == 1 else ' '

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
        print()

    def _is_safe(self, row, col) -> bool:
        # verify if row is safe
        for i in range(self.queens):
            if self.chess[row][i] == 1:
                return False

        diff = 0

        # verify if diagonals are safe
        while diff < self.queens:
            if row - diff > -1 and col - diff > -1 and self.chess[row - diff][col - diff] == 1 or \
                    row - diff > -1 and col + diff < self.queens and self.chess[row - diff][col + diff] == 1 or \
                    row + diff < self.queens and col - diff > -1 and self.chess[row + diff][col - diff] == 1 or \
                    row + diff < self.queens and col + diff < self.queens and self.chess[row + diff][col + diff] == 1:

                return False

            diff += 1

        return True

    def place_queen(self, row, col):
        self.chess[row][col] = 1

    def remove_queen(self, row, col):
        self.chess[row][col] = 0

    def _dfs(self, curr_column):

        for row in range(0, self.queens):
            self.steps += 1

            if self._is_safe(row, curr_column):
                self.states += 1

                self.place_queen(row, curr_column)

                if curr_column == self.queens - 1:
                    self.total_steps += self.steps

                    if (self.print_sols):
                        print('steps:', self.steps)
                        self._print_chess()

                else:
                    self.total_steps += self.steps
                    self._dfs(curr_column + 1)

                self.remove_queen(row, curr_column)

    @timer
    def solve(self):
        self._dfs(0)
        return self.total_steps, self.states


if __name__ == "__main__":

    argparser = ArgumentParser()
    argparser.add_argument('-nq', metavar='--queens', type=int, help="the number of queens", default=4)
    argparser.add_argument('--no-print', dest='ps', action=BooleanOptionalAction,
                           help="`True` to print solutions", default=True)

    args = argparser.parse_args()
    queens: int = args.nq
    print_sols: bool = args.ps

    solver = NQueens(queens, print_sols)
    total_steps, states = solver.solve()

    print(f"\ntotal\n  :- {total_steps} steps")
    print(f"  :- {states} states")
