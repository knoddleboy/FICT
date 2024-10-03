from typing import Optional
import logging

logger_path = None


def __logger_init__(log_path: Optional[str] = None):
    global logger_path
    logger_path = log_path
    logging.basicConfig(filename=log_path,
                        filemode='w',
                        format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                        datefmt='%H:%M:%S',
                        level=logging.DEBUG)


NQLogger = logging.getLogger(logger_path)
