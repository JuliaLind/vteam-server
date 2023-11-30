DROP FUNCTION IF EXISTS extract_ref;

DELIMITER ;;

CREATE FUNCTION extract_ref(
    c_nr VARCHAR(100)
)
RETURNS INT
DETERMINISTIC
BEGIN
    SET @ref := CONCAT("***", RIGHT(c_nr, 4));
    RETURN @ref;
END
;;

DELIMITER ;