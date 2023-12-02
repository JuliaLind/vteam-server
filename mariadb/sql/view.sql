DROP VIEW IF EXISTS v_zone_loc;
DROP VIEW IF EXISTS v_trip;

CREATE VIEW v_zone_loc AS
SELECT
    id,
    zone_id,
    city_id,
    date_from,
    date_to,
    `geometry`
FROM `zone_loc` AS zl
LEFT JOIN
    `zone_loc_removed` AS zlr
    ON zl.id = zlr.zone_loc_id
;

CREATE VIEW v_trip AS
SELECT
    *,
    (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
;
