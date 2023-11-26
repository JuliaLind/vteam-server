DROP PROCEDURE IF EXISTS user_payment;
DROP PROCEDURE IF EXISTS invoice;

DELIMITER ;;

--
-- Note! Not tested yet!
--
CREATE PROCEDURE invoice()
BEGIN
    DECLARE cursor_id INT;
    DECLARE cursor_card VARCHAR(100);
    DECLARE cursor_balance INT;
    DECLARE done INT DEFAULT FALSE;

    -- select all users with negative balances
    -- including inactive as those too may have
    -- unpaid trips
    DECLARE cursor_i CURSOR FOR
    SELECT
        id,
        card_nr,
        balance
    FROM
        `user`
    WHERE
        balance < 0
    ;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cursor_i;
    read_loop: LOOP
        -- split each row into variables
        FETCH cursor_i INTO cursor_id, cursor_card, cursor_balance;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- payment will be the full negative balance on the account
        SET @payment := 0 - cursor_balance;

        -- add into payment table
        INSERT INTO payment(user_id, ref, amount)
        VALUES(
            cursor_id,
            -- CONCAT("***", RIGHT(cursor_id, 4)),
            extract_ref(cursor_id),
            @payment
        );

        -- adjust users balance with the "payment"
        UPDATE `user`
        SET
            balance = balance + @payment
        WHERE
            id = cursor_id
        ;
    END LOOP;
    CLOSE cursor_i;
END
;;

CREATE PROCEDURE user_payment(
    u_id INT,
    p_amount INT
)
BEGIN
    SET @ref := extract_ref((SELECT card_nr FROM `user` WHERE id = u_id));

    INSERT INTO payment(user_id, ref, amount)
    VALUES(u_id, @ref, p_amount);

    UPDATE `user`
    SET
        balance = balance + p_amount
    WHERE
        id = u_id
    ;
END
;;
DELIMITER ;
