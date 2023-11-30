DROP PROCEDURE IF EXISTS user_search;
DROP PROCEDURE IF EXISTS all_users;
DROP PROCEDURE IF EXISTS all_users_pag;

DELIMITER ;;

CREATE PROCEDURE user_search(
    a_what VARCHAR(100)
)
BEGIN
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

