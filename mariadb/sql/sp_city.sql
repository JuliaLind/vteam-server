DROP PROCEDURE IF EXISTS all_cities;

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

-- CREATE PROCEDURE zones_for_bike(
--     b_id
-- )
-- BEGIN
--     -- FORTSÄTT HÄRIFRÅN
-- END
-- ;;

DELIMITER ;
