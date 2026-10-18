from ai.utils.entity_extractor.entity_normalizer import EntityNormalizer

def test_normalize_organization():
    normalizer = EntityNormalizer()
    assert (normalizer.normalize("WHO", "organization") == "World Health Organization")
    assert (normalizer.normalize("W.H.O.", "organization") == "World Health Organization")
    assert (normalizer.normalize("World Health Organisation", "organization")== "World Health Organization")

def test_normalize_location():
    normalizer = EntityNormalizer()
    assert (normalizer.normalize("Gaza Strip", "location")== "Gaza")
    assert (normalizer.normalize("Gaza", "location")== "Gaza")

def test_unknown_organization():
    normalizer = EntityNormalizer()
    assert (normalizer.normalize("Some Unknown Organization","organization") == "Some Unknown Organization")

def test_person_is_not_normalized():
    normalizer = EntityNormalizer()
    assert (normalizer.normalize("Joe Biden","person") == "Joe Biden")

def test_event_is_not_normalized():
    normalizer = EntityNormalizer()
    assert (normalizer.normalize("Israel-Hamas war","event")== "Israel-Hamas war")
