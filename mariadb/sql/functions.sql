-- DROP FUNCTION IF EXISTS extract_speed;


-- DELIMITER ;;

-- CREATE FUNCTION extract_speed(
--     z_id,
--     c_id
-- )
-- RETURNS INT
-- DETERMINISTIC
-- BEGIN
--     SET @speed := (SELECT speed
--     FROM speed_limit WHERE zone_id = z_id);
--     IF @speed IS NULL THEN
--     SET @speed := (SELECT speed_limit FROM city WHERE id = c_id);
--     RETURN @speed;
-- END
-- ;;


-- DELIMITER ;