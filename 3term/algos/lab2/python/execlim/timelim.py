from contextlib import contextmanager
from typing import Optional, Callable
import signal


class TimeLimitError(Exception):
    pass


@contextmanager
def timelim(__sec: int, __callback: Optional[Callable[[], None]] = None):
    """Decorator to limit time usage of a function. Call `__callback` or raise `TimeLimitError` when the limit is exceeded.

    Args:
        __sec (int): Maximum computation time of the function, in seconds.
        __callback (Callable): Callback to fire when the time limit is exceeded.

    Raises:
        __callback or TimeLimitError: When the function reaches the limit.
    """

    def _signal_handler(signum, frame):
        if __callback:
            __callback()
            exit(1)

        else:
            raise TimeLimitError(f"Execution time exceeded the time limit of {__sec} seconds.")

    signal.signal(signal.SIGALRM, _signal_handler)
    signal.alarm(__sec)

    try:
        yield

    finally:
        signal.alarm(0)
