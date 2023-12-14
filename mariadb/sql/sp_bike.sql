DROP PROCEDURE IF EXISTS single_bike;
DROP PROCEDURE IF EXISTS bike_statuses;
DROP PROCEDURE IF EXISTS deactivate;
DROP PROCEDURE IF EXISTS activate;
DROP PROCEDURE IF EXISTS all_bikes;
DROP PROCEDURE IF EXISTS available_bikes;
DROP PROCEDURE IF EXISTS update_bike;
DROP PROCEDURE IF EXISTS update_bike_city;
DROP PROCEDURE IF EXISTS bikes_in_city;
DROP PROCEDURE IF EXISTS upd_bike_status;
DROP PROCEDURE IF EXISTS is_rented;



DELIMITER ;;

--
-- Sets a bike's active-field to true
-- Takes bike's id as parameter
-- "Returns" the bikes most recent data
--
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

    SELECT * FROM v_bike
    WHERE id = b_id;
END
;;

--
-- Updates a bike's status.
-- The parameters are bike's id
-- and the new status id.
-- "Returns" the bikes most recent data
--
CREATE PROCEDURE upd_bike_status(
    b_id INT,
    s_id INT
)
BEGIN
    UPDATE
        `bike`
    SET
        status_id = s_id
    WHERE
        id = b_id
    ;

    SELECT * FROM v_bike
    WHERE id = b_id;
END
;;

--
-- Updates the city to which the bike
-- is registered. The bike must be within
-- the registered city to be able to move.
-- Takes bike's id and the city's id as parameters.
-- "Returns" the bikes most recent data
--
CREATE PROCEDURE update_bike_city(
    b_id INT,
    c_id VARCHAR(10)
)
BEGIN
    UPDATE
        `bike`
    SET
        `city_id` = c_id
    WHERE
        id = b_id
    ;

    SELECT * FROM v_bike
    WHERE id = b_id;
END
;;

--
-- Sets the bike's active-field to false.
-- Checks if there is any trip registered to the
-- bike in the trip table that does not have
-- an end-time. If there is one the trip
-- is ended in the 'standard' way and both the
-- full trip-info and the bike-data are "returned".
-- If no ongoing trip then only the bike data
-- is returned
--
CREATE PROCEDURE deactivate(
    b_id INT
)
BEGIN
    UPDATE
        `bike`
    SET
        `active` = FALSE
    WHERE
        id = b_id
    ;

    -- trip must be ended before select
    -- from bike table, because
    -- the status of the bike is changed-
    -- when trip is ended
    CALL end_ongoing_trip(b_id);

    SELECT * FROM v_bike
    WHERE id = b_id;

END
;;

--
-- "Returns" all possible statuses that a bike
-- can have. 
--
CREATE PROCEDURE bike_statuses()
BEGIN
    SELECT
        *
    FROM
        `status`
    ;
END
;;

--
-- "Returns" all bikes, both active and inactivated
-- in all cities
--
CREATE PROCEDURE all_bikes()
BEGIN
    SELECT
        *
    FROM v_bike;
END
;;

--
-- "Returns" only the bikes that
-- can be rented. The request is done
-- for one city at a time and the parameter
-- is the city's id
--
CREATE PROCEDURE available_bikes(
    c_id VARCHAR(10)
)
BEGIN
    SELECT
        *
    FROM v_bike
    WHERE status_id = 1
    AND `active` = TRUE
    AND city_id = c_id
    ;
END
;;

--
-- Returns data for a single bike.
-- Parameter is the bike's id
--
CREATE PROCEDURE single_bike(
    b_id INT
)
BEGIN
    SELECT
        *
    FROM v_bike
    WHERE id = b_id
    ;
END
;;

--
-- Returns all bikes in a city, both active
-- and inactive. The parameter is the
-- city's id
--
CREATE PROCEDURE bikes_in_city(
    c_id VARCHAR(10)
)
BEGIN
    SELECT
        *
    FROM v_bike
    WHERE city_id = c_id
    ;
END
;;

--
-- Updates a bikes attributes.
-- the parameters are: the id of the bike to be updated
-- and the new statusid, charge percentage and coordinates
--
CREATE PROCEDURE update_bike(
    b_id INT,
    b_status INT,
    b_charge DECIMAL(3,2),
    b_coords VARCHAR(100)
)
BEGIN
    SET @old_charge := (SELECT
    charge_perc FROM bike WHERE id = b_id);
    -- check NEW first because it will happen
    -- fewer times that charge percentage is less or equal
    -- to 3% than that the percentage is higher than 3%
    -- so this way most of the times only first condition
    -- will need to be checked. The second condition is
    -- because if the bike is charging (percentage going up)
    -- we do not need to check for any ongoing trip
    UPDATE
        `bike`
    SET
        status_id = b_status,
        charge_perc = b_charge,
        coords = b_coords
    WHERE id = b_id
    ;
    -- there is no risk that a trip starts at exactly 3% because
    -- the bike will get status maintenance required
    -- at a much higher percentage
    IF b_charge <= 0.03 AND @old_charge > 0.03 THEN
        CALL end_ongoing_trip(b_id);
    END IF;
END
;;

--
-- Procedure for checking if a bike is rented.
-- If the bike is rented, "returns" the id of the trip
--
CREATE PROCEDURE is_rented(
    b_id INT
)
BEGIN
    SELECT id FROM trip 
    WHERE bike_id = b_id
    AND end_time IS NULL;
END;;

DELIMITER ;