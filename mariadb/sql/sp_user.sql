DROP PROCEDURE IF EXISTS user_search;
DROP PROCEDURE IF EXISTS all_users;
DROP PROCEDURE IF EXISTS all_users_pag;
DROP PROCEDURE IF EXISTS upd_user_status;
DROP PROCEDURE IF EXISTS upd_user_email;
DROP PROCEDURE IF EXISTS new_user;
DROP PROCEDURE IF EXISTS user_login;


DELIMITER ;;

--
-- Inserts new user into the database.
-- parameters are email, cardnumber and
-- card type (id).
-- "Returns" the id and the email of the user
--
CREATE PROCEDURE new_user(
    u_email VARCHAR(100),
    c_nr VARCHAR(100),
    c_type INT
)
BEGIN
    INSERT INTO `user` (email, card_nr, card_type)
    VALUES(u_email, c_nr, c_type);

    SELECT id, email
    FROM `user`
    WHERE email = u_email;
END
;;

--
-- Takes user's email as parameter
-- and if the user is active returns
-- the user's id and email.
--
CREATE PROCEDURE user_login(
    u_email VARCHAR(100)
)
BEGIN
    SELECT id, email
    FROM `user`
    WHERE email = u_email
    AND `active` = TRUE;
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
        `id`,
        `email`,
        `balance`,
        `active`
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
        `id`,
        `email`,
        `balance`,
        `active`
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
        `id`,
        `email`,
        `balance`,
        `active`
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
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
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
        `id`,
        `email`,
        `balance`,
        `active`
    FROM
        `user`
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

DELIMITER ;

