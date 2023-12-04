DROP PROCEDURE IF EXISTS all_cities;
DROP PROCEDURE IF EXISTS single_city;
DROP PROCEDURE IF EXISTS zones_in_city;
DROP PROCEDURE IF EXISTS all_zones;
DROP PROCEDURE IF EXISTS bike_zones;

DELIMITER ;;


CREATE PROCEDURE all_cities()
BEGIN
    SELECT
        *
    FROM
        `city`
    ;
END
;;

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

CREATE PROCEDURE all_zones()
BEGIN
    SELECT
        *
    FROM
        `v_zone_loc`
    ;
END
;;

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
