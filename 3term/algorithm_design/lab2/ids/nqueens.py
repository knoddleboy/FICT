# lab 2

"""
Problem: From a random arrangement of queens on the chessboard get such arrangement that 
         the queens do not attack each other vertically, horizontally and diagonally.
Solution: IDS (main) and A* (mod) with heuristics: number of Q pairs that attack each other with visibility
Constraints: 30 min, 1GiB of space
"""

from argparse import ArgumentParser, ArgumentTypeError
from tree import NQueens
from helpers.timer import Timer
from helpers.logger import __logger_init__

from execlim.timelim import timelim
from execlim.memlim import memlim


def pos_int(val):
    ival = int(val)
    if (ival < 0):
        raise ArgumentTypeError("must provide non-negative value")
    return ival


if __name__ == "__main__":
    argparser = ArgumentParser()
    argparser.add_argument('-q', type=pos_int, default=4)
    argparser.add_argument('-l', type=str, default='nq.log')

    # get number of queens from cl args
    queens: int = argparser.parse_args().q
    log_path: str = argparser.parse_args().l

    # Set up the logger
    __logger_init__(log_path)

    # Create root node's board
    NQ = NQueens(queens)

    # Print the root node's board
    NQ.root.board.print(pre=f"Generated {queens}x{queens} board:", end='')
    print(f"  :- conflicts: {NQ.root.board.conflict_number()}\n")

    def mem_failure_callback():
        print("--- memoty usage exceeded ---\n")
        print("Last board state:")
        NQ.last_node.board.print()
        NQ.info(show_depth=True)

    def time_failure_callback():
        print("--- execution time exceeded ---\n")
        print("Last board state:")
        NQ.last_node.board.print()
        NQ.info(show_depth=True)

    @memlim(1024, mem_failure_callback)         # 1GiB
    @timelim(30 * 60, time_failure_callback)    # 30 min
    def __solve():
        with Timer():
            NQ.IDS()

    __solve()

    print(f"\n** logged to {log_path} **")
