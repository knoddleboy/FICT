from typing import Any, Optional
from copy import deepcopy
from board import Board


class Node:
    def __init__(self, queens: Optional[int] = None, other=None) -> None:
        self.depth: int
        self.board: Board
        self.children: list[Any]

        if other and isinstance(other, Node):
            self.depth = other.depth + 1
            self.board = Board(other=other.board)
            self.children = [None] * (self.board.size * (self.board.size - 1))

        elif other and isinstance(other, Board):
            self.depth = 1
            self.board = deepcopy(other)
            self.children = [None] * (self.board.size * (self.board.size - 1))

        elif not other:
            self.depth = 1
            self.board = Board(queens=queens)  # create empty board
            self.board.generate_board()
            self.children = [None] * (self.board.size * (self.board.size - 1))

    @property
    def cost(self):
        _g = self.depth
        _h = self.board.conflict_number()
        return _g + _h

    # Comparator for priority queue
    def __lt__(self, node):
        return self.cost < node.cost

    def is_solved(self):
        return self.board.conflict_number() == 0

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
