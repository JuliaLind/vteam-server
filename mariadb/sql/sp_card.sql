DROP PROCEDURE IF EXISTS card_types;
DROP PROCEDURE IF EXISTS user_card;
DROP PROCEDURE IF EXISTS upd_user_card;

DELIMITER ;;

--
-- "Returns" all currently available card types
--
CREATE PROCEDURE card_types()
BEGIN
    SELECT
        *
    FROM
        `card`
    ;
END
;;

--
-- "Returns" card details of a user
--
CREATE PROCEDURE user_card(
    u_id INT
)
BEGIN
    SELECT
        card_nr,
        card_type,
        card_type_descr
    FROM
        `v_user_card`
    WHERE
        user_id = u_id
    ;
END
;;

--
-- Updates card nr and card type of a user.
-- Parameters are the id of the user, the new
-- number of the card and the id of the
-- new card type
--
CREATE PROCEDURE upd_user_card(
    u_id INT,
    c_nr VARCHAR(100),
    c_type INT
)
BEGIN
    INSERT INTO `user_card`
    VALUES(u_id, c_nr, c_type)
    ON DUPLICATE KEY
    UPDATE
        card_nr = c_nr,
        card_type = c_type
    ;

    CALL user_card(u_id);
END
;;

DELIMITER ;