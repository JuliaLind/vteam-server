DROP PROCEDURE IF EXISTS user_trips;

DELIMITER ;;


CREATE PROCEDURE user_trips(
    u_id INT
)
BEGIN
    SELECT
        *
    FROM
        `trips`
    WHERE
        `user_id` = u_id
    ;
END
;;

DELIMITER ;