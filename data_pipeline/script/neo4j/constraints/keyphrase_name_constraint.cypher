CREATE CONSTRAINT keyphrase_name_unique IF NOT EXISTS
FOR (k:Keyphrase)
REQUIRE k.name IS UNIQUE;