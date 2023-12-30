DROP PROCEDURE IF EXISTS active_api_keys;

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

DELIMITER ;
