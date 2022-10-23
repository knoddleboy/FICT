from typing import Any
from board import Board
from copy import deepcopy
from typing import Optional


class Node:
    def __init__(self, queens: Optional[int] = None, other=None) -> None:
        self.depth: int
        self.board: Board
        self.children: list[Any]

        if not other:
            self.depth = 1
            self.board = Board(queens=queens)  # create empty board
            self.board.generate_board()
            self.children = [None] * (self.board.size * (self.board.size - 1))

        else:
            self.depth = other.depth + 1
            self.board = Board(other=other.board)
            self.children = [None] * (self.board.size * (self.board.size - 1))

    @property
    def is_solved(self):
        return self.board.conflict_number == 0

    def expand(self):
        row = 0
        shift = 1

        for i in range(len(self.children)):
            if shift == self.board.size:
                row += 1
                shift = 1

            cp = deepcopy(self)

            self.children[i] = Node(other=cp)
            self.children[i].board.move_figure(row, shift)

            shift += 1
