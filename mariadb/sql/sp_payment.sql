DROP PROCEDURE IF EXISTS user_payments_pag;
DROP PROCEDURE IF EXISTS user_payments;
DROP PROCEDURE IF EXISTS all_payments_pag;
DROP PROCEDURE IF EXISTS all_payments;
DROP PROCEDURE IF EXISTS prepay;
DROP PROCEDURE IF EXISTS invoice;

DELIMITER ;;

--
-- "Returns" all payments (a payment can be
-- a prepaid amount or an 'automatic' payment)
--
CREATE PROCEDURE all_payments()
BEGIN
    SELECT
        *
    FROM
        `payment`
    ORDER BY
        `date` DESC
    ;
END
;;

--
-- "Returns" all payments for a user.
-- Parameter is the user's id
--
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
        `date` DESC
    ;
END
;;

--
-- Returns user's payments in intervals.
-- Parameters are the user's id,
-- offset - i.e. the last row before
-- the row to be selected
-- and the limit - i.e. the max number
-- of rows to be selected
--
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
        `date` DESC
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;


--
-- Returns all payments in intervals.
-- Parameters are:
-- offset - i.e. the last row before
-- the row to be selected
-- and the limit - i.e. the max number
-- of rows to be selected
--
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
        `date` DESC
    LIMIT a_limit
    OFFSET a_offset
    ;
END
;;

--
-- Adds a new transaction for each user that
-- has a negative balance, of the corresponding
-- positive amount. And adjusts the
-- balance accordingly. The reference for the
-- automatic payment will consist of the word
-- "AUTO " plus the ordinary reference of ***
-- and the four last digits of the user's card
-- that has been debited
--
CREATE PROCEDURE invoice()
BEGIN
    DECLARE cursor_id INT;
    DECLARE cursor_balance DECIMAL(7,2);
    DECLARE error_occurred BOOLEAN DEFAULT FALSE;
    DECLARE done BOOLEAN DEFAULT FALSE;


    -- START TRANSACTION;

    -- select all users with negative balances
    -- including inactive as those too may have
    -- unpaid trips

    DECLARE cursor_i CURSOR FOR
    SELECT
        id,
        balance
    FROM
        `user`
    WHERE
        balance < 0
    ;

    -- Declare handler outside the loop
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- an error could be thrown from extract_ref
        -- function if the user has not registered a card
        INSERT INTO error_log(message) VALUES(CONCAT('Payment could not be processed for user: ', cursor_id, ', card number missing - ', SQLERRM()));
        SET error_occurred = TRUE; -- Set the error flag
    END;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET @count := 0;
    SET @amount := 0;

    OPEN cursor_i;
    read_loop: LOOP
        SET error_occurred = FALSE;
        -- split each row into variables
        FETCH cursor_i INTO cursor_id, cursor_balance;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- payment will be the full negative balance on the account
        SET @payment := 0 - cursor_balance;


        -- add into payment table
        INSERT INTO payment(user_id, ref, amount)
        VALUES(
            cursor_id,
            CONCAT("AUTO ", extract_ref(cursor_id)),
            @payment
        );

        -- if a payment could not be done the user's balance
        -- should not be updated, moves on to next user
        IF error_occurred THEN
            SET error_occurred = FALSE;
            ITERATE read_loop;
        END IF;

        -- if no error happened when extracting card reference
        -- increase the count of invoiced users
        -- and the total invoiced amount
        SET @count = @count + 1;
        SET @amount = @amount + @payment;

        -- adjust users balance with the "payment"
        UPDATE `user`
        SET
            balance = balance + @payment
        WHERE
            id = cursor_id
        ;
    END LOOP;
    CLOSE cursor_i;

    -- COMMIT;

    SELECT @count AS invoiced_users;
    SELECT @amount AS invoiced_amount;
END
;;

--
-- A payment done by user. Parameters
-- are the user's id and the amount to be paid.
-- There is a trigger connected to the payment table
-- that will detected a negative or 0 amount and
-- raise an error.
--
-- "Returns" the details of the payments + the new balance of the user
--
CREATE PROCEDURE prepay(
    u_id INT,
    p_amount DECIMAL(7,2)
)
BEGIN
    SET @ref := extract_ref(u_id);

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
        `date` DESC
    LIMIT 1;
END
;;

DELIMITER ;
