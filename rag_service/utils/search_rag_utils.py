import time
import re

def parse_time_window_to_epoch(time_str: str) -> int:
    default_seconds = 24 * 60 * 60
    current_epoch = int(time.time())
    
    if not time_str:
        return current_epoch - default_seconds

    match = re.match(r"^(\d+)([hd])$", time_str.strip().lower())
    if not match:
        print(f"Warning: Invalid time format '{time_str}'. Defaulting to 24h.")
        return current_epoch - default_seconds

    value, unit = match.groups()
    value = int(value)

    if unit == 'h':
        seconds_ago = value * 60 * 60
    elif unit == 'd':
        seconds_ago = value * 24 * 60 * 60
    else:
        seconds_ago = default_seconds

    return current_epoch - seconds_ago