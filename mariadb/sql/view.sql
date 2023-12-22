-- DROP VIEW IF EXISTS v_user;
DROP VIEW IF EXISTS v_zone_loc;
DROP VIEW IF EXISTS v_all_zone_loc;
DROP VIEW IF EXISTS v_trip;
DROP VIEW IF EXISTS v_bike;
DROP VIEW IF EXISTS v_user_card;

--
-- View contains all zones and all
-- their data, including from- and to-dates
--
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

--
-- Besides all data in trip table,
-- also contains the total cot for the trip
--
CREATE VIEW v_trip AS
SELECT
    *,
    (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    ORDER BY start_time DESC
;

--
-- Besides the data in the bike table
-- also contains the description of the bike's
-- status
--
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

CREATE VIEW v_user_card AS
SELECT
    user_id,
    card_nr,
    card_type,
    (SELECT `name` FROM `card` WHERE id = card_type) AS card_type_descr
    FROM user_card;


-- --
-- -- The fields that
-- -- are selected together
-- -- in several stored procedures
-- --
-- CREATE VIEW v_user AS
-- SELECT
--     `id`,
--     `email`,
--     `balance`,
--     `active`
-- FROM
--     `user`
-- ;

