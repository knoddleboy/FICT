from copy import deepcopy
from node import Node
from logger import NQLogger


class NQueens:
    def __init__(self, queens: int) -> None:
        self.memory_states: int = 1
        self.total_states: int = 1
        self.iter: int = 0
        self.size = queens
        self.root = Node(queens=queens)
        self.last_node: Node

    def IDS(self):
        NQLogger.info("** IDS Algorithm **")

        limit = 1
        while not self._LDFS(self.root, limit):
            limit += 1
            self.memory_states += 1

        # print info
        self.info()

        return True

    def _LDFS(self, node: Node, limit: int):
        self.iter += 1
        self.last_node = deepcopy(node)

        if (node.is_solved()):
            NQLogger.info("** IDS Solved **")

            print("Solved board:")
            node.board.print()

            print("bounds:")
            print(f"  :- depth: {node.depth}")
            print(f"  :- limit: {limit}\n")

            return True

        if node.depth < limit:
            NQLogger.info(f"#{self.iter}: Expand with {len(node.children)} child nodes")

            node.expand()
            self.memory_states += self.size * 2
            self.total_states += self.size * 2

            for i in range(len(node.children)):
                if self._LDFS(node.children[i], limit):
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
