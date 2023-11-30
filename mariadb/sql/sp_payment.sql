DROP PROCEDURE IF EXISTS user_payments;
DROP PROCEDURE IF EXISTS prepay;
DROP PROCEDURE IF EXISTS invoice;

DELIMITER ;;

CREATE PROCEDURE user_payments(
    u_id INT
)
BEGIN
    SELECT
        *
    FROM
        `payment`
    WHERE
        `user_id` = u_id
    ;
END
;;

--
-- Note! Not tested yet!
--
CREATE PROCEDURE invoice()
BEGIN
    DECLARE cursor_id INT;
    DECLARE cursor_card VARCHAR(100);
    DECLARE cursor_balance DECIMAL(7,2);
    DECLARE done BOOLEAN DEFAULT FALSE;

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

    SET @count := 0;
    SET @amount := 0;

    OPEN cursor_i;
    read_loop: LOOP
        -- split each row into variables
        FETCH cursor_i INTO cursor_id, cursor_card, cursor_balance;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- payment will be the full negative balance on the account
        SET @payment := 0 - cursor_balance;
        SET @count = @count + 1;
        SET @amount = @amount + @payment;

        -- add into payment table
        INSERT INTO payment(user_id, ref, amount)
        VALUES(
            cursor_id,
            extract_ref(cursor_card),
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
    SELECT @count AS invoiced_users;
    SELECT @amount AS invoiced_amount;
END
;;


CREATE PROCEDURE prepay(
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
