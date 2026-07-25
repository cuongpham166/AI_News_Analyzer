from enum import IntEnum
import logging

class LoggerLevels(IntEnum):
    DEBUG = logging.DEBUG #Developer information
    INFO = logging.INFO #Normal operation
    WARNING = logging.WARNING #Recoverable problems
    ERROR = logging.ERROR #Failed operations
    CRITICAL = logging.CRITICAL #Service cannot continue
