# Inspired by https://github.com/egeucak/Python-Memory-Limiter.git

from functools import wraps
from typing import Optional, Callable
from queue import Queue, Empty
from threading import Thread
import tracemalloc
import _thread


class MemoryUsageExceeded(Exception):
    pass


def __memory_monitor(command_queue: Queue, poll_interval: int, memory_limit: int):
    tracemalloc.start()
    snapshot1 = tracemalloc.take_snapshot()

    while True:
        try:
            command_queue.get(timeout=poll_interval)
            tracemalloc.stop()
            return

        except Empty:
            snapshot2 = tracemalloc.take_snapshot()
            top_stats = snapshot2.compare_to(snapshot1, 'lineno')
            total = sum(stat.size for stat in top_stats) / (1024 * 1024)  # bytes to mb

            if total > memory_limit:
                command_queue.put(total)
                tracemalloc.stop()
                _thread.interrupt_main()
                return


def memlim(__mblim: int, __callback: Optional[Callable[[], None]] = None, __poll_interval: int = 1):
    """Decorator to limit memory usage of a function. Call `__callback` or raise `MemoryUsageExceeded` when the limit is exceeded.

    Args:
        __mblim (int): Maximum number of megabytes the function can allocate.
        __callback (Callable): Callback to fire when the memory limit is exceeded.
        __poll_interval (int): Time (in sec) between the end of the previous memory amount check and the next one.

    Raises:
        __callback or MemoryUsageExceeded: When the function reaches the limit.
    """

    queue = Queue()

    def _limit_memory(f):

        @wraps(f)
        def _limiter(*args, **kwargs):
            global monitor_thread
            global val

            exception = False

            try:
                monitor_thread = Thread(target=__memory_monitor, args=(queue, __poll_interval, __mblim))
                monitor_thread.start()
                val = f(*args, **kwargs)
                queue.put('stop')

            except KeyboardInterrupt:
                exception = True

            finally:
                monitor_thread.join()

            if exception:
                if __callback:
                    __callback()
                    exit(1)

                else:
                    raise MemoryUsageExceeded(
                        f"The limit was {__mblim:.4f} mb, but the function consumed {queue.get():.4f} mb memory.")
            else:
                return val

        return _limiter

    return _limit_memory
