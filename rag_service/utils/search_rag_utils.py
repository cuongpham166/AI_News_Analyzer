import re
import time
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta


def parse_time_window_to_epoch(time_str: str) -> int:
    default_seconds = 24 * 60 * 60
    current_epoch = int(time.time())

    if not time_str:
        return current_epoch - default_seconds

    match = re.fullmatch(r"(\d+)(h|d|w|M|y)", time_str.strip())

    if not match:
        print(
            f"Warning: Invalid time format '{time_str}'. "
            "Defaulting to 24h."
        )
        return current_epoch - default_seconds

    value, unit = match.groups()
    value = int(value)

    if value <= 0:
        return current_epoch - default_seconds

    now = datetime.now(timezone.utc)

    if unit == "h":
        start = now - relativedelta(hours=value)
    elif unit == "d":
        start = now - relativedelta(days=value)
    elif unit == "w":
        start = now - relativedelta(weeks=value)
    elif unit == "M":
        start = now - relativedelta(months=value)
    elif unit == "y":
        start = now - relativedelta(years=value)

    return int(start.timestamp())
