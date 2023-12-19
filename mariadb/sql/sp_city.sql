DROP PROCEDURE IF EXISTS all_cities;
DROP PROCEDURE IF EXISTS single_city;
DROP PROCEDURE IF EXISTS zones_in_city;
DROP PROCEDURE IF EXISTS all_zones;
DROP PROCEDURE IF EXISTS bike_zones;

DELIMITER ;;

--
-- "Returns" id, name, general speed limit
-- and the city-limits for all cities
--
CREATE PROCEDURE all_cities()
BEGIN
    SELECT
        *
    FROM
        `city`
    ;
END
;;

--
-- "Returns" id, name, general speed limit
-- and the city-limits for a single city.
-- Parameter is the id of the city
--
CREATE PROCEDURE single_city(
    c_id VARCHAR(10)
)
BEGIN
    SELECT
        *
    FROM
        `city`
    WHERE id = c_id
    ;
END
;;

--
-- Returns all active zones (locations)
-- in the city. The fields are
-- the id of the location, id of the zone (type),
-- description (for example 'forbidden'),
-- id of the city the zone is in, geometry and
-- speed limit (which is an integer or null).
-- The parameter is the id of the city
--
CREATE PROCEDURE zones_in_city(
    c_id VARCHAR(10)
)
BEGIN
    SELECT
        *
    FROM
        `v_zone_loc`
    WHERE
        city_id = c_id
    ;
END
;;

--
-- Returns all active zones in all cities
--
CREATE PROCEDURE all_zones()
BEGIN
    SELECT
        *
    FROM
        `v_zone_loc`
    ;
END
;;

--
-- "Returns" the information of the city
-- the bike is registered to and the information
-- for all the zones in that city
--
CREATE PROCEDURE bike_zones(
    b_id INT
)
BEGIN
    SET @cityid := (SELECT city_id FROM bike WHERE id = b_id);

    SELECT
        @cityid AS city_id,
        `geometry`,
        speed_limit
    FROM `city`
    WHERE id = @cityid;

    -- extract only zones that have
    -- speed limit restrictions
    SELECT
        zone_id,
        `geometry`,
        speed_limit
    FROM v_zone_loc
    WHERE city_id = @cityid
    AND speed_limit IS NOT NULL;
END
;;

DELIMITER ;
