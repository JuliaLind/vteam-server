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
RETURNS INT
READS SQL DATA
BEGIN
    SET @zone := (SELECT
        zone_id
    FROM v_zone_loc
    WHERE
        date_to IS NULL
    AND
        ST_Within(
            ST_GeomFromGeoJSON(
                CONCAT('{"type":"Point","coordinates":', coord, '}')
            ),
            ST_GeomFromGeoJSON(geometry)
        ) = 1
    );
    RETURN @zone;
END
;;

DELIMITER ;