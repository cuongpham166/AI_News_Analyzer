import re

from ai.responses.ner_response import NerResult
from data_pipeline.models.inference_article import Entities, Person, Organization, Location, Event

def create_entity_id(entity_type: str, value: str) -> str:
    #entity_type: org, person, event, location
    value = value.lower().strip()
    value = re.sub(r"[^\w\s]", "", value)
    value = re.sub(r"\s+", "_", value)
    return f"{entity_type}_{value}"

def map_ner_to_entities(ner_response:NerResult) -> Entities:
    entities = Entities()
    for ent in ner_response.entities:
        entity_type = ent.type.lower()
        if entity_type == "person":
            entities.persons.append(Person(id=create_entity_id(entity_type, ent.value), name=ent.value))
        elif entity_type == "organization":
            entities.organizations.append(Organization(id=create_entity_id(entity_type, ent.value), name=ent.value))
        elif entity_type == "location":
            entities.locations.append(Location(id=create_entity_id(entity_type, ent.value), name=ent.value))
        elif entity_type == "event":
            entities.events.append(Event(id=create_entity_id(entity_type, ent.value), name=ent.value))
        else:
            print(f"[NER WARNING] Unknown entity type: {ent.type} -> {ent.value}")
    return entities

def build_metablock_for_embedding(ner_response:NerResult)->str:
    person_entity_string ="People: "
    organization_entity_string="Organizations: "
    location_entity_string="Locations: "
    event_entity_string="Events: "

    person_entities=[]
    organization_entities=[]
    location_entities=[]
    event_entities=[]
    entity_strings=[]

    for ent in ner_response.entities:
        entity_type = ent.type.lower()
        if entity_type == "person":
            person_entities.append(ent.value)
        elif entity_type == "organization":
            organization_entities.append(ent.value)
        elif entity_type == "location":
            location_entities.append(ent.value)
        elif entity_type == "event":
            event_entities.append(ent.value)

    if len(person_entities)>0:
        person_entity_string+= ", ".join(person_entities)
        entity_strings.append(person_entity_string)
    if len(organization_entities)>0:
        organization_entity_string+= ", ".join(organization_entities)
        entity_strings.append(organization_entity_string)
    if len(location_entities)>0:
        location_entity_string+= ", ".join(location_entities)
        entity_strings.append(location_entity_string)
    if len(event_entities)>0:
        event_entity_string+= ", ".join(event_entities)
        entity_strings.append(event_entity_string)

    metadata_block = " | ".join(entity_strings)
    return metadata_block