DROP PROCEDURE IF EXISTS user_trips;

DELIMITER ;;


CREATE PROCEDURE user_trips(
    u_id INT
)
BEGIN
    SELECT
        *,
        (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    WHERE
        `user_id` = u_id
    ;
END
;;

DELIMITER ;