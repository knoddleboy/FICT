# lab 2

"""
Problem: Place 8 queens on chessboard such that no two queens are in same row, column, and diagonal.
Solution: We will put the queens one by one in each column while satisfying the requried criteria. If such a queen can not be placed, we will backtrack until a valid configuration is possible.
Looking at the problem definition we know that two queens can not be in same column. Hence we will put each queen in the adjacent column to the previous placed one. We have to just find the suitable row while placing and mainting the constraint.
"""

from argparse import ArgumentParser, ArgumentTypeError
from tree import NQueens
from timer import Timer
from logger import __logger_init__

from execlim.timelim import timelim
# from execlim.memlim import memlim
from execlim.memlim1 import memlim


def pos_int(val):
    ival = int(val)
    if (ival < 0):
        raise ArgumentTypeError("must provide non-negative value")
    return ival


if __name__ == "__main__":
    argparser = ArgumentParser()
    argparser.add_argument('-nq', type=pos_int, default=4)
    argparser.add_argument('-l', type=str, default='nq.log')

    # get number of queens from cl args
    queens: int = argparser.parse_args().nq
    log_path: str = argparser.parse_args().l

    # Set up the logger
    __logger_init__(log_path)

    # Create root node's board
    NQ = NQueens(queens)

    # Print the root node's board
    NQ.root.board.print(pre=f"Generated {queens}x{queens} board:", end='')
    print(f"  :- conflicts: {NQ.root.board.conflict_number}\n")

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

    # @memlim(1024 ** 3, mem_failure_callback)
    @memlim(1)
    # @timelim(60, time_failure_callback)
    def __solve():
        with Timer():
            NQ.IDS()

    __solve()

    print(f"\n** logged to {log_path} **")
