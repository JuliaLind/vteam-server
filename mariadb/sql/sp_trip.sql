DROP PROCEDURE IF EXISTS user_trips;
-- DROP PROCEDURE IF EXISTS within_zone;

DELIMITER ;;

-- CREATE PROCEDURE within_zone(
--     json_point VARCHAR(100)
-- )
-- BEGIN
--     SELECT
--         id
--     FROM city
--     WHERE
--         ST_Within(
--             ST_GeomFromGeoJSON(
--                 CONCAT('{"type":"Point","coordinates":', json_point, '}')
--             ),
--             ST_GeomFromGeoJSON(geometry)
--         ) = 1
--     ;
-- END;


CREATE PROCEDURE user_trips(
    u_id INT
)
BEGIN
    SELECT
        *,
        (start_cost + var_cost + park_cost) AS total_cost
    FROM
        `trip`
    WHERE
        `user_id` = u_id
    ;
END
;;

DELIMITER ;