DROP PROCEDURE IF EXISTS emp_login;

DELIMITER ;;

--
-- Takes username as parameter and returns
-- all employee's details unless the employee
-- has been deactivated- If deactivated returns null
--
CREATE PROCEDURE emp_login(
    a_username VARCHAR(30)
)
BEGIN
    SELECT
        id,
        username,
        `hash`,
        `role`
    FROM
        `employee`
    WHERE
        `username` = a_username
    AND `active` = TRUE
    ;
END
;;

DELIMITER ;