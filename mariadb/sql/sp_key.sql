DROP PROCEDURE IF EXISTS new_other_key;
DROP PROCEDURE IF EXISTS active_api_keys;
DROP PROCEDURE IF EXISTS all_keys;

DELIMITER ;;

--
-- "Returns" all active API keys
-- and the type of client they are connected to.
-- "other" means 3rd party
--
CREATE PROCEDURE active_api_keys()
BEGIN
    SELECT `key`, `client_type_id`
    FROM api_key
    WHERE `active` = TRUE;
END
;;

--
-- inserts new key for 3rd party
--
CREATE PROCEDURE new_other_key(
    a_email VARCHAR(200),
    a_key CHAR(32)
)
BEGIN
    -- raise an error if the third party is already
    -- and has received an api key
    IF (SELECT id FROM third_party WHERE email = a_email) IS NOT NULL THEN
        SET @key := (SELECT `key` FROM v_third_party WHERE email = a_email);
        SET @message := CONCAT('email ', a_email, ' already registered with key ', @key);
            SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = @message;
    END IF;

    -- register the api key
    INSERT INTO api_key(client_type_id, `key`)
    VALUES ("other", a_key);

    -- register the third party
    SET @key_id := (SELECT id FROM api_key WHERE `key` = a_key);
    INSERT INTO third_party(api_key_id, email)
    VALUES(@key_id, a_email);

    -- select email and api key
    SELECT * FROM v_third_party WHERE email = a_email;
END
;;


--
-- "Returns" all API keys regardless of active
-- or inactive, to be used in method for generating new unique api key
--
CREATE PROCEDURE all_keys()
BEGIN
    SELECT `key`
    FROM api_key;
END
;;

DELIMITER ;
