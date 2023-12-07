DROP PROCEDURE IF EXISTS user_payments_pag;
DROP PROCEDURE IF EXISTS user_payments;
DROP PROCEDURE IF EXISTS all_payments_pag;
DROP PROCEDURE IF EXISTS all_payments;
DROP PROCEDURE IF EXISTS prepay;
DROP PROCEDURE IF EXISTS invoice;

DELIMITER ;;

CREATE PROCEDURE all_payments()
BEGIN
    SELECT
        *
    FROM
        `payment`
    ORDER BY
        `id` DESC
    ;
END
;;

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
    ORDER BY
        `id` DESC
    ;
END
;;

CREATE PROCEDURE user_payments_pag(
    u_id INT,
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        *
    FROM
        `payment`
    WHERE
        `user_id` = u_id
    ORDER BY
        `id` DESC
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

CREATE PROCEDURE all_payments_pag(
    a_offset INT,
    a_limit INT
)
BEGIN
    SELECT
        *
    FROM
        `payment`
    ORDER BY
        `id` DESC
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;


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
            CONCAT("AUTO ", extract_ref(cursor_card)),
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
    p_amount DECIMAL(7,2)
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

    SELECT *,
    (SELECT balance FROM `user` WHERE id = u_id) AS balance
    FROM payment
    WHERE user_id = u_id
    AND amount = p_amount
    AND ref = @ref
    ORDER BY
        id DESC
    LIMIT 1;

    -- SELECT balance
    -- FROM user
    -- WHERE id = u_id;
END
;;

DELIMITER ;
