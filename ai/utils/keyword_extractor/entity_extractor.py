
class EntityExtractor:
    def __init__(self, text_normalizer):
        self.text_normalizer = text_normalizer

    def extract_entities(self,processed_doc):
        allowed = {"GPE", "ORG", "PERSON", "EVENT", "LOC", "FAC", "NORP"}
        entities = []
        for ent in processed_doc.ents:
            if ent.label_ not in allowed:
                continue
            text = self.text_normalizer.normalize(ent.text)
            # drop weak nationality adjectives
            if ent.label_ == "NORP" and len(text.split()) == 1:
                continue
            entities.append((text, ent.label_))
        return entities
