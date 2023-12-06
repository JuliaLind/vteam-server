DROP FUNCTION IF EXISTS extract_ref;
DROP FUNCTION IF EXISTS within_zone;

DELIMITER ;;

CREATE FUNCTION extract_ref(
    c_nr VARCHAR(100)
)
RETURNS CHAR(7)
DETERMINISTIC
BEGIN
    SET @ref := CONCAT("***", RIGHT(c_nr, 4));
    RETURN @ref;
END
;;

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