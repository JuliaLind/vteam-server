DROP FUNCTION IF EXISTS extract_ref;
DROP FUNCTION IF EXISTS within_zone;

DELIMITER ;;

--
-- Takes user id as parameter
-- and returns the referense for a prepay
-- user payment. The reference consists of
-- three * plus the last four digits of the
-- card number
--
CREATE FUNCTION extract_ref(
    u_id INT
)
RETURNS CHAR(7)
READS SQL DATA
BEGIN
    SET @card_nr := (
        SELECT card_nr
        FROM user_card
        WHERE user_id = u_id
    );

    IF @card_nr IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot make payment, no card provided';
    END IF;

    SET @ref := CONCAT("***", RIGHT(@card_nr, 4));
    RETURN @ref;
END
;;

--
-- The passed coord paramtere is a json stringified
-- array with lng and lat coordinates. Returns 1 if
-- the coordinate is within a parking or a charging
-- zone, otherwise returns 0. Used to determine the
-- start-cost and the parking cost for a trip
--
CREATE FUNCTION within_zone(
    coord VARCHAR(100)
)
RETURNS TINYINT
DETERMINISTIC
BEGIN
    SET @check := (SELECT
        id
    FROM v_zone_loc
    WHERE
        zone_id IN (1, 2)
    AND
        ST_Within(
            ST_GeomFromGeoJSON(
                CONCAT('{"type":"Point","coordinates":', coord, '}')
            ),
            ST_GeomFromGeoJSON(geometry)
        ) = 1
    LIMIT 1
    );

    IF @check IS NOT NULL THEN
        RETURN 1;
    END IF;
    RETURN 0;
END
;;

DELIMITER ;