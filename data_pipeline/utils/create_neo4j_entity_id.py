import re

def create_entity_id(entity_type: str, value: str) -> str:
    #entity_type: org, person, event, location
    value = value.lower().strip()
    value = re.sub(r"[^\w\s]", "", value)
    value = re.sub(r"\s+", "_", value)
    return f"{entity_type}_{value}"