DROP TRIGGER IF EXISTS check_charge_value;
DROP TRIGGER IF EXISTS check_payment_value;

DELIMITER ;;

--
-- Ensures that the charge value is 'correct'.
-- cannot be below 0% or above 100%
--
CREATE TRIGGER check_charge_value
BEFORE UPDATE ON `bike`
FOR EACH ROW
BEGIN
    IF NEW.charge_perc < 0.00 OR NEW.charge_perc > 1.00 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'The charge percentage should be a value between 0.00 - 1.00';
    END IF;
END
;;

--
-- Ensure that the 'payment' done by user
-- is correct, the amount should not be 0 or negative
--
CREATE TRIGGER check_payment_value
BEFORE INSERT ON `payment`
FOR EACH ROW
BEGIN
    IF NEW.amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment amount must be larger than 0';
    END IF;
END
;;



DELIMITER ;