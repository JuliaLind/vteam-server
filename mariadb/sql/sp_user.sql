DROP PROCEDURE IF EXISTS all_users;

DELIMITER ;;


CREATE PROCEDURE all_users()
BEGIN
    SELECT
        *
    FROM
        `user`
    ;
END
;;

DELIMITER ;