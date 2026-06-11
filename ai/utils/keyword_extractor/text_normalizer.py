import re
from ai.shared.keyword_alias import alias_map

class TextNormalizer:
    def __init__(self):
        self.alias_map = alias_map or {}

    def clean(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"^(the|a|an)\s+", "", text, flags=re.IGNORECASE)
        return text.strip()

    def apply_alias(self, text: str) -> str:
        return self.alias_map.get(text.lower(), text)

    def smart_case(self, text: str) -> str:
        if text.isupper():
            return text
        return " ".join(
            w if w.isupper() else w.capitalize()
            for w in text.split()
        )

    def normalize(self,input_text) -> str:
        text = self.clean(text=input_text)
        text = self.apply_alias(text)
        text = self.smart_case(text)
        return text