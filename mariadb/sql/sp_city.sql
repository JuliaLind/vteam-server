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

DELIMITER ;
