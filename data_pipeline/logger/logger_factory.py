import logging
import sys
from pathlib import Path

from pythonjsonlogger.json import JsonFormatter
from data_pipeline.logger.logger_levels import LoggerLevels
from data_pipeline.logger.pipeline_logger import PipelineLogger

class LoggerFactory:
    _configured = False


    @staticmethod
    def configure(
            level: LoggerLevels = LoggerLevels.INFO,
            log_file: str = "data_pipeline/logs/pipeline.log"
    ):

        if LoggerFactory._configured:
            return

        Path(log_file).parent.mkdir(
            parents=True,
            exist_ok=True
        )

        formatter = JsonFormatter(
            fmt=(
                "%(timestamp)s "
                "%(level)s "
                "%(name)s "
                "%(message)s "
                "%(service)s"
            )
        )

        file_handler = logging.FileHandler(
            log_file,
            encoding="utf-8"
        )
        file_handler.setFormatter(formatter)

        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)

        root_logger = logging.getLogger()
        root_logger.setLevel(level)

        root_logger.addHandler(file_handler)
        root_logger.addHandler(console_handler)

        LoggerFactory._configured = True

    @staticmethod
    def get_logger(name):
        logger = logging.getLogger(name)
        return PipelineLogger(logger)