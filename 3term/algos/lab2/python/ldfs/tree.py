from copy import deepcopy
from node import Node
from board import Board, Optional
from helpers.logger import NQLogger


class NQueens:
    def __init__(self, queens: int, board: Optional[Board] = None) -> None:
        self.memory_states: int = 1
        self.total_states: int = 1
        self.iter: int = 0
        self.size = queens
        self.last_node: Node
        self.root = Node(queens=queens, other=board if board else None)

    def LDFS(self):
        NQLogger.info("** LDFS Algorithm **")

        limit = 1
        while not self._IDS(self.root, limit):
            limit += 1

        # print info
        self.info()

        return True

    def _IDS(self, node: Node, limit: int):
        self.iter += 1
        self.last_node = deepcopy(node)

        print("Last:")
        node.board.print()

        if (node.is_solved()):
            NQLogger.info("** LDFS Solved **")

            print("Solved board:")
            node.board.print()

            print("bounds:")
            print(f"  :- depth: {node.depth}")
            print(f"  :- limit: {limit}\n")

            return True

        for i in range(self.size + 2):
            print('\033[1A', end='\x1b[2K')

        # impl
        if node.depth < limit:
            NQLogger.info(f"#{self.iter}: Expand with {len(node.children)} child nodes")

            node.expand()
            self.total_states += len(node.children)

            for i in range(len(node.children)):
                if self._IDS(node.children[i], limit):
                    self.memory_states += len(node.children)
                    return True

        return False

    def info(self, show_depth: bool = False):
        print("total:")
        print(f"  :- iterations: {self.iter}")
        print(f"  :- states: {self.total_states}")
        print(f"  :- memory states: {self.memory_states}")

        if show_depth:
            print(f"  :- depth: {self.last_node.depth}")

        print()
