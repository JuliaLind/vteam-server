DROP PROCEDURE IF EXISTS card_types;

DELIMITER ;;


CREATE PROCEDURE card_types()
BEGIN
    SELECT
        *
    FROM
        `card`
    ;
END
;;

DELIMITER ;