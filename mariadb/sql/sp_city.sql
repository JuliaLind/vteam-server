DROP PROCEDURE IF EXISTS all_cities;
DROP PROCEDURE IF EXISTS single_city;
DROP PROCEDURE IF EXISTS zones_in_city;
DROP PROCEDURE IF EXISTS all_zones;

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

-- CREATE PROCEDURE zones_for_bike(
--     b_id
-- )
-- BEGIN
--     -- FORTSÄTT HÄRIFRÅN
-- END
-- ;;

DELIMITER ;
