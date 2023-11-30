DROP PROCEDURE IF EXISTS emp_login;

DELIMITER ;;


CREATE PROCEDURE emp_login(
    a_username VARCHAR(30)
)
BEGIN
    SELECT
        *
    FROM
        `employee`
    WHERE
        `username` = a_username
    AND `active` = TRUE
    ;
END
;;

DELIMITER ;