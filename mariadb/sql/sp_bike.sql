DROP PROCEDURE IF EXISTS bike_statuses;

DELIMITER ;;


CREATE PROCEDURE bike_statuses()
BEGIN
    SELECT
        *
    FROM
        `status`
    ;
END
;;

DELIMITER ;