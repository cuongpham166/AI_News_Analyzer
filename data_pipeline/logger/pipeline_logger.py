import logging

class PipelineLogger:
    def __init__(self, logger: logging.Logger):
        self.logger = logger

    def debug(self, message: str, **kwargs):
        self.logger.debug(message, extra=kwargs)

    def info(self, message, **kwargs):
        self.logger.info(message, extra=kwargs)

    def warning(self, message, **kwargs):
        self.logger.warning(message, extra=kwargs)

    def error(self, message, **kwargs):
        self.logger.error(message, extra=kwargs)

    def exception(self, message, **kwargs):
        self.logger.exception(message, extra=kwargs)