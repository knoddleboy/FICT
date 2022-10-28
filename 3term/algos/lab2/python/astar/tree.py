from queue import PriorityQueue
from typing import Optional
from node import Node
from board import Board
from helpers.logger import NQLogger


class NQueens:
    def __init__(self, queens: int, board: Optional[Board] = None) -> None:
        self.memory_states: int = 1
        self.total_states: int = 1
        self.iter: int = 0
        self.size = queens
        self.root = Node(queens=queens, other=board if board else None)

    def AStar(self):
        NQLogger.info("** A* Algorithm **")

        # priority queue that uses pre-defined heuristic function implemented in node's comparator
        opened: PriorityQueue[Node] = PriorityQueue()
        closed: list[Board] = []

        opened.put(self.root)
        NQLogger.info("Put root into queue")

        while not opened.empty():
            top = opened.get()

            if top.is_solved():
                NQLogger.info("** A* Solved **")

                print("Solved board:")
                top.board.print()

                self.total_states = opened.qsize() + len(closed)
                self.memory_states = opened.qsize()

                self.info()
                break

            closed.append(top.board)

            NQLogger.info(f"#{self.iter}: Expand with {len(top.children)} successors")
            top.expand()

            successors: list[Node] = top.children

            for i in range(len(successors)):
                for j in range(len(closed)):
                    if successors[i].board == closed[j]:
                        continue

                opened.put(successors[i])

            self.iter += 1

    def info(self):
        print("total:")
        print(f"  :- iterations: {self.iter}")
        print(f"  :- states: {self.total_states}")
        print(f"  :- memory states: {self.memory_states}\n")
