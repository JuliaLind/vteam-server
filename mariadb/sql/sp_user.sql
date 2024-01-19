DROP PROCEDURE IF EXISTS user_login_pass;
DROP PROCEDURE IF EXISTS user_register;
DROP PROCEDURE IF EXISTS user_search;
DROP PROCEDURE IF EXISTS all_users;
DROP PROCEDURE IF EXISTS all_users_pag;
DROP PROCEDURE IF EXISTS upd_user_status;
DROP PROCEDURE IF EXISTS upd_user_email;
DROP PROCEDURE IF EXISTS user_login;


DELIMITER ;;

--
-- Inserts new user into the database if
-- email is not already registered
-- 
-- "Returns" the id and the email of the user
-- if the user has not been deactivated,
-- otherwise throws error
--
CREATE PROCEDURE user_login(
    u_email VARCHAR(100)
)
BEGIN
    DECLARE user_id INT;
    DECLARE is_active BOOLEAN;

    INSERT IGNORE INTO `user` (email)
    VALUES(u_email);

    SELECT id, active INTO user_id, is_active FROM user WHERE email = u_email;

    -- throw an error if user is deactivated
    IF is_active = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User is deactivated';
    END IF;

    SELECT user_id AS id, u_email AS email;
END
;;

--
-- Inserts new user into the database if
-- email is not already registered
-- 
-- "Returns" the id and the email of the user
-- if the user has not been deactivated,
-- otherwise throws error
--
CREATE PROCEDURE user_register(
    u_email VARCHAR(100),
    u_hash VARCHAR(100)
)
BEGIN
    -- will throw error if user exists
    INSERT INTO `user` (email)
    VALUES(u_email);

    SET @user_id := (SELECT id FROM user WHERE email = u_email);

    INSERT INTO `user_hash`
    VALUES(@user_id, u_hash);

    SELECT @user_id AS id, u_email AS email;
END
;;

--
-- 
-- "Returns" the id, hash and the email of the user
-- if the user has not been deactivated,
-- otherwise throws error
--
CREATE PROCEDURE user_login_pass(
    u_email VARCHAR(100)
)
BEGIN
    DECLARE u_id INT;
    DECLARE is_active BOOLEAN;

    SELECT id, active INTO u_id, is_active FROM user WHERE email = u_email;

    -- throw an error if user is deactivated
    IF is_active = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User is deactivated';
    END IF;

    SET @hash := (SELECT `hash` FROM user_hash WHERE user_id = u_id);

    SELECT u_id AS id, u_email AS email, @hash AS `hash`;
END
;;


--
-- Takes the user's id and a boolean value
-- for active as parameters and sets the user's
-- active-field to the boolean value. To be
-- used by admin.
-- Returns the user's id, email, balance and
-- active-status
--
CREATE PROCEDURE upd_user_status(
    u_id INT,
    u_active BOOLEAN
)
BEGIN
    UPDATE `user`
    SET `active` = u_active
    WHERE id = u_id;

    SELECT
        *
    FROM
        `user`
    WHERE `id` = u_id
    ;
END
;;

--
-- Updates a user's email. Takes
-- user's id and new email as parameters.
-- Returns the user's id, email, balance and
-- active-status
--
CREATE PROCEDURE upd_user_email(
    u_id INT,
    u_email VARCHAR(100)
)
BEGIN
    UPDATE `user`
    SET `email` = u_email
    WHERE id = u_id;

    SELECT
        *
    FROM
        `user`
    WHERE `id` = u_id
    ;
END
;;

--
-- Can be used for wildcard or exact search
-- in the id and email columns of the user table.
-- For wildcard search the passed parameter
-- needs to have a % symbol before, after or both
--
CREATE PROCEDURE user_search(
    a_what VARCHAR(100)
)
BEGIN
    DECLARE results INT;

    SELECT COUNT(*) INTO results
    FROM `user`
    WHERE id LIKE a_what
    OR email LIKE a_what;

    IF results = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No users matched the search-criteria';
    END IF;

    SELECT
        *
    FROM
        `user`
    WHERE `id` LIKE a_what
    OR `email` LIKE a_what
    ;
END
;;

--
-- "Returns" id, email, balance and active-status
-- of all users, both active and deactivated
--
CREATE PROCEDURE all_users()
BEGIN
    SELECT
        *
    FROM `user`
    ;
END
;;

--
-- "Returns" id, email, balance and active-status
-- of all users, both active and deactivated
-- in intervals. The parameters are offset
-- and limit for the interval
--
CREATE PROCEDURE all_users_pag(
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        *
    FROM
        `user`
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

DELIMITER ;

