CREATE CONSTRAINT organization_name_unique IF NOT EXISTS
FOR (o:Organization)
REQUIRE o.name IS UNIQUE;