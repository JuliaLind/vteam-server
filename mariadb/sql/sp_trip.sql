DROP PROCEDURE IF EXISTS user_trips;
DROP PROCEDURE IF EXISTS start_trip;
DROP PROCEDURE IF EXISTS end_trip;

DELIMITER ;;

CREATE PROCEDURE start_trip(
    u_id INT,
    b_id INT
)
BEGIN
    DECLARE bikeid INT;
    DECLARE userid INT;

    -- Your SELECT query that retrieves two values
    SELECT bike_id, user_id
    INTO bikeid, userid
    FROM
        `trip`
    WHERE
        bike_id = b_id
    AND
        end_pos IS NULL;

    IF bikeid IS NULL THEN
        SET @start_pos := (SELECT coords FROM `bike` WHERE id = b_id);

        INSERT INTO `trip`(user_id, bike_id, start_pos)
        VALUES(u_id, b_id, @start_pos);

    ELSEIF userid != u_id THEN
        SET @message := CONCAT('Bike ', b_id, ' is already rented');
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @message;
    END IF;

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
        bike_id = b_id;
END
;;

CREATE PROCEDURE end_trip(
    t_id INT,
    u_id INT
)
BEGIN
    DECLARE userid INT;
    DECLARE bikeid INT;
    DECLARE starttime DATETIME;
    DECLARE startpos VARCHAR(100);
    DECLARE endtime DATETIME;

    SET @endtime := CURRENT_TIMESTAMP;

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
        IF @endzone IN (1, 2) THEN
            -- set the parking cost to low
            SET @parktype := "PARK_LOW";

            -- if the bike did not start in parking zone
            -- or charging zone, but ended in one of these
            -- zone types, the start cost should also be set to low
            IF @startzone NOT IN (1, 2) THEN
                SET @starttype := "START_LOW";
            END IF;
        END IF;

        -- calculate variable cost as the duration of the trip
        -- in minutes time the variable cost per minute
        SET @varcost := TIMESTAMPDIFF(MINUTE, starttime, @endtime) * (SELECT amount FROM price WHERE id = "VAR");
        -- get the startcost based on cost type
        SET @startcost := (SELECT amount FROM price WHERE id = @starttype);
        -- get the parking cost based on cost type
        SET @parkcost := (SELECT amount FROM price WHERE id = @parktype);


        -- update the trip with the new additional data
        UPDATE trip
        SET
            end_time = @endtime,
            end_pos = @endpos,
            start_cost = @startcost,
            var_cost = @varcost,
            park_cost = @parkcost
        WHERE id = t_id
        ;
    END IF;

    -- return all data for the trip + calculated total cost
    SELECT *, (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    WHERE id = t_id;
END
;;




CREATE PROCEDURE user_trips(
    u_id INT
)
BEGIN
    SELECT
        *,
        (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    WHERE
        `user_id` = u_id
    ;
END
;;

DELIMITER ;