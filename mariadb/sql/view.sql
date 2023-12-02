DROP VIEW IF EXISTS v_zone_loc;
DROP VIEW IF EXISTS v_all_zone_loc;
DROP VIEW IF EXISTS v_trip;
DROP VIEW IF EXISTS v_bike;


CREATE VIEW v_all_zone_loc AS
SELECT
    zl.id AS id,
    zl.zone_id,
    zone.descr,
    city_id,
    date_from,
    date_to,
    `geometry`,
    speed
FROM `zone_loc` AS zl
LEFT JOIN
    `zone_loc_removed` AS zlr
    ON zl.id = zlr.zone_loc_id
LEFT JOIN `zone`
    ON zone_id = zone.id
LEFT JOIN speed_limit
    ON zl.zone_id = speed_limit.zone_id
;
--
-- only active zones
--
CREATE VIEW v_zone_loc AS
SELECT
    id,
    zone_id,
    descr,
    city_id,
    `geometry`,
    speed AS speed_limit
FROM v_all_zone_loc
WHERE
    date_to IS NULL
;

CREATE VIEW v_trip AS
SELECT
    *,
    (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
;

CREATE VIEW v_bike AS
SELECT
    bike.id AS id,
    city_id,
    status_id,
    descr AS status_descr,
    charge_perc,
    coords,
    `active`
FROM
    `bike`
LEFT JOIN `status`
ON status_id = status.id
;

