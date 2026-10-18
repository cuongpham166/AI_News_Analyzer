INSERT INTO location_coordinates (
    location_name,
    latitude,
    longitude,
    country,
    country_code
)
SELECT
    value,
    0.0,
    0.0,
    'UNKNOWN',
    'XX'
FROM entity
WHERE entity_type_id = 3
ON CONFLICT (location_name) DO NOTHING;
