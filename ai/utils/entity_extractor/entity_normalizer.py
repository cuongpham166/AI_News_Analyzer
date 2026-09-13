from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import yaml


NORMALIZABLE_ENTITY_TYPES = {
    "organization",
    "location",
}

def normalize_for_lookup(value: str) -> str:
    if not value:
        return ""
    value = unicodedata.normalize("NFKC", value)
    value = value.casefold().strip()
    value = value.replace(".", "")
    value = re.sub(r"\s+", " ", value)
    return value

def clean_entity(value: str) -> str:
    value = unicodedata.normalize("NFKC", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


class EntityNormalizer:
    def __init__(self, aliases_path: str | Path | None = None):
        if aliases_path is None:
            self.aliases_path = (
                    Path(__file__).resolve().parents[2]
                    / "config"
                    / "entity_aliases.yaml"
            )
        else:
            self.aliases_path = Path(aliases_path)

        self.aliases = self._load_aliases()

    def _load_aliases(self) -> dict[str, dict[str, str]]:
        with self.aliases_path.open("r", encoding="utf-8") as file:
            config = yaml.safe_load(file) or {}

        result = {}

        for entity_type, canonicals in config.items():
            lookup = {}

            for canonical, aliases in canonicals.items():
                aliases = aliases or []

                all_aliases = [canonical, *aliases]

                for alias in all_aliases:
                    key = normalize_for_lookup(alias)

                    if not key:
                        continue

                    existing = lookup.get(key)

                    if existing is not None and existing != canonical:
                        raise ValueError(
                            f"Conflicting alias in {self.aliases_path}: "
                            f"{alias!r} maps to both "
                            f"{existing!r} and {canonical!r}"
                        )

                    lookup[key] = canonical

            result[entity_type] = lookup

        return result

    def normalize(self,text: str,entity_type: str) -> str:
        if not text:
            return text

        cleaned = clean_entity(text)

        if entity_type not in NORMALIZABLE_ENTITY_TYPES:
            return cleaned

        lookup = self.aliases.get(entity_type, {})
        key = normalize_for_lookup(cleaned)

        return lookup.get(key, cleaned)
