DROP PROCEDURE IF EXISTS bike_statuses;
DROP PROCEDURE IF EXISTS deactivate;
DROP PROCEDURE IF EXISTS activate;
DROP PROCEDURE IF EXISTS all_bikes;
DROP PROCEDURE IF EXISTS update_bike;

DELIMITER ;;

CREATE PROCEDURE activate(
    b_id INT
)
BEGIN
    UPDATE
        `bike`
    SET
        `active` = TRUE
    WHERE
        id = b_id
    ;
END
;;

CREATE PROCEDURE deactivate(
    b_id INT
)
BEGIN
    DECLARE tripid INT;
    DECLARE userid INT;
    SELECT id, user_id
    INTO tripid, userid
    FROM
        `trip`
    WHERE
        bike_id = b_id
    AND
        end_pos IS NULL;

    UPDATE
        `bike`
    SET
        `active` = FALSE
    WHERE
        id = b_id
    ;

    SELECT *
    FROM
        `bike`
    WHERE
        id = b_id;

    -- If the bike is rented, end the ongoing trip
    IF tripid IS NOT NULL THEN
        CALL end_trip(tripid, userid);
    END IF;

END
;;

CREATE PROCEDURE bike_statuses()
BEGIN
    SELECT
        *
    FROM
        `status`
    ;
END
;;

CREATE PROCEDURE all_bikes()
BEGIN
    SELECT
        *
    FROM
        `bike`
    ;
END
;;

CREATE PROCEDURE update_bike(
    b_id INT,
    b_status INT,
    b_charge DECIMAL(3,2),
    b_coords VARCHAR(100)
)
BEGIN
    UPDATE
        `bike`
    SET
        status_id = b_status,
        charge_perc = b_charge,
        coords = b_coords
    WHERE id = b_id
    ;
END
;;

DELIMITER ;