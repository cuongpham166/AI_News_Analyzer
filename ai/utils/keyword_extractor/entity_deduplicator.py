from rapidfuzz import fuzz

class EntityDeduplicator:
    def __init__(self):
        pass

    def deduplicate(self, items, threshold=90):
        result = []
        for kw, score in sorted(items, key=lambda x: len(x[0]), reverse=True):
            kw_l = kw.lower()
            duplicate = False

            for ex_kw, _ in result:
                ex_l = ex_kw.lower()

                if kw_l in ex_l or ex_l in kw_l:
                    duplicate = True
                    break

                if fuzz.ratio(kw_l, ex_l) >= threshold:
                    duplicate = True
                    break

            if not duplicate:
                result.append((kw, score))

        return result