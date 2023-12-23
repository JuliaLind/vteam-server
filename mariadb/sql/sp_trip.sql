DROP PROCEDURE IF EXISTS user_trips;
DROP PROCEDURE IF EXISTS user_trips_pag;
DROP PROCEDURE IF EXISTS all_trips;
DROP PROCEDURE IF EXISTS all_trips_pag;
DROP PROCEDURE IF EXISTS start_trip;
DROP PROCEDURE IF EXISTS end_ongoing_trip;
DROP PROCEDURE IF EXISTS end_trip;

DELIMITER ;;

--
-- Initiates a new trip by inserting a new row
-- into the trip table. Parameters are user's id
-- and the id of the bike the user wants to rent.
-- Returns the initally registered details of
-- the trip: trip id, user id, bike id, start time
-- and start position (coordinates)
--
CREATE PROCEDURE start_trip(
    u_id INT,
    b_id INT
)
BEGIN
    DECLARE bikeid INT;
    DECLARE userid INT;

    -- ensure that a new trip cannot be
    -- started before user registers a payment
    -- card
    SET @check := (SELECT
    card_nr FROM user_card
    WHERE user_id = u_id);
    IF (@check IS NULL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No payment card registered';
    END IF;

    --
    -- Cannot rent a bike that is not available
    -- or deactivated
    --
    IF (SELECT id
    FROM `bike`
    WHERE
        id = b_id
    AND `status_id` = 1
    AND `active` = TRUE) IS NULL THEN
    SET @message := CONCAT('Cannot rent bike ', b_id);
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @message;
    END IF
    ;

    -- This is only executed if a bike is available
    -- and active, thus no further checks are required
    UPDATE `bike`
    SET status_id = 2
    WHERE id = b_id;
    SET @start_pos := (SELECT coords FROM `bike` WHERE id = b_id);

    INSERT INTO `trip`(user_id, bike_id, start_pos)
    VALUES(u_id, b_id, @start_pos);

    --
    -- No need to use order or limit as
    -- a bike can only have one unended trip
    -- at a time
    --
    SELECT
        `id`,
        `user_id`,
        `bike_id`,
        `start_time`,
        `start_pos`
    FROM trip
    WHERE
        user_id = u_id
    AND
        bike_id = b_id
    AND end_time IS NULL
    -- ORDER BY id DESC
    -- LIMIT 1
    ;
END
;;

--
-- Ends a trip by adding an end-time, an
-- end-position and calculating all the
-- parts of the cost. If the current status
-- of bike is rented, will set the bike-status
-- to available. If not, will not change the bike status.
-- Parameters are the user id and the trip id.
-- User id is neccessary so that no-one tries to
-- end another user's trip.
-- "Returns" the full details of the trip + the calculated total cost.
--
CREATE PROCEDURE end_trip(
    u_id INT,
    t_id INT
)
BEGIN
    DECLARE userid INT;
    DECLARE bikeid INT;
    DECLARE starttime DATETIME;
    DECLARE startpos VARCHAR(100);
    DECLARE endtime DATETIME;

    SET @newtime := CURRENT_TIMESTAMP;

    --
    -- Select some current variables for the trip
    --
    SELECT user_id, bike_id, start_time, start_pos, end_time
    INTO userid, bikeid, starttime, startpos, endtime
    FROM
        `trip`
    WHERE
        id = t_id;


    --
    -- If trip belongs to another user raise an error
    --
    IF u_id != userid THEN
        SET @message := CONCAT('No trip with id ', t_id, ' found for user ', u_id);
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @message;
    --
    -- If endtime is NULL it means the trip
    -- is not ended
    --
    ELSEIF endtime IS NULL THEN
        -- set initial cost types
        SET @starttype := "START_HIGH";
        SET @parktype := "PARK_HIGH";

        -- get the last known position of bike
        -- as end position for the trip
        SET @endpos := (SELECT coords FROM `bike` WHERE id = bikeid); 
        -- get the zone number that the start position is
        -- within (if any)
        SET @startzone := within_zone(startpos);
        -- get the zone number that the end position is
        -- within (if any)
        SET @endzone := within_zone(@endpos);

        -- check if the trip is ended in
        -- parking zone or charging zone
        IF @endzone = 1 THEN
            -- set the parking cost to low
            SET @parktype := "PARK_LOW";

            -- if the bike did not start in parking zone
            -- or charging zone, but ended in one of these
            -- zone types, the start cost should also be set to low
            IF @startzone = 0 THEN
                SET @starttype := "START_LOW";
            END IF;
        END IF;

        -- calculate variable cost as the duration of the trip
        -- in minutes time the variable cost per minute
        -- I am using SECOND / 60 instead of MINUTE
        -- because MINUTE does not seem to return value if
        -- duration is less than a minute
        SET @varcost := TIMESTAMPDIFF(SECOND, starttime, @newtime) / 60 * (SELECT amount FROM price WHERE id = "VAR");
        -- get the startcost based on cost type
        SET @startcost := (SELECT amount FROM price WHERE id = @starttype);
        -- get the parking cost based on cost type
        SET @parkcost := (SELECT amount FROM price WHERE id = @parktype);


        -- update the trip with the new additional data
        UPDATE trip
        SET
            end_time = @newtime,
            end_pos = @endpos,
            start_cost = @startcost,
            var_cost = @varcost,
            park_cost = @parkcost
        WHERE id = t_id
        ;
    END IF;

    -- if status is rented update to available
    IF (SELECT status_id
    FROM bike WHERE id = bikeid) = 2 THEN
        UPDATE bike
        SET status_id = 1
        WHERE id = bikeid;
    END IF;

    -- if status is rented maintenance required update
    -- to maintenance required
    IF (SELECT status_id
    FROM bike WHERE id = bikeid) = 5 THEN
        UPDATE bike
        SET status_id = 4
        WHERE id = bikeid;
    END IF;

    -- return all data for the trip + calculated total cost
    -- if multiple requests this procedure will not update values but return same ones
    SELECT *, (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    WHERE id = t_id;
END
;;

--
-- This procedure is to be used when the bike
-- is being deactivated by admin. Checks if
-- there is an ongoing trip for the bike
-- that is being deactivated and if yes- ends it.
-- Parameter is the id of the bike
--
CREATE PROCEDURE end_ongoing_trip(
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

    -- If the bike is rented, end the ongoing trip
    IF tripid IS NOT NULL THEN
        CALL end_trip(userid, tripid);
    END IF;
END
;;

--
-- Returns all trips done by a user.
-- Parameter is the id of the user
--
CREATE PROCEDURE user_trips(
    u_id INT
)
BEGIN
    SELECT
        *
    FROM
        `v_trip`
    WHERE
        `user_id` = u_id
    ;
END
;;

--
-- Returns all trips done by all users
--
CREATE PROCEDURE all_trips()
BEGIN
    SELECT
        *
    FROM
        `v_trip`
    ;
END
;;


--
-- Returns all trips done by all users in
-- intervals. Parameters are the offset and the
-- limit for the interval
--
CREATE PROCEDURE all_trips_pag(
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        *
    FROM
        `v_trip`
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

--
-- Returns trips for a user in intervals.
-- Parameters are user's id, offset and limit
-- for the selected interval
--
CREATE PROCEDURE user_trips_pag(
    u_id INT,
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        *
    FROM
        `v_trip`
    WHERE
        `user_id` = u_id
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

DELIMITER ;