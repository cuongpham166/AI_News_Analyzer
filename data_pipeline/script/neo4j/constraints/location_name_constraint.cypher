CREATE CONSTRAINT location_name_unique IF NOT EXISTS
FOR (l:Location)
REQUIRE l.name IS UNIQUE;