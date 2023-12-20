-- To be used from docker-container.
-- Different relative paths compared to
-- the local files

LOAD DATA LOCAL INFILE './mariadb/csv/keys.csv'
INTO TABLE `api_key`
CHARSET utf8
FIELDS
    TERMINATED BY '\r\n'
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\r\n'
IGNORE 1 LINES
(`key`)
;

LOAD DATA LOCAL INFILE './mariadb/csv/city.csv'
INTO TABLE `city`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY "'"
LINES
    TERMINATED BY '\r\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/employee.csv'
INTO TABLE `employee`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(@id,@username,@password,@hash, @role)
SET `id`=@id, `username`=@username, `hash`=@hash, `role`=@role
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/card.csv'
INTO TABLE `card`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/user.csv'
INTO TABLE `user`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(id, email, card_nr, card_type, balance)
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/status.csv'
INTO TABLE `status`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/bike.csv'
INTO TABLE `bike`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\r\n'
IGNORE 1 LINES
(id, city_id, coords)
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/payment.csv'
INTO TABLE `payment`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;


LOAD DATA LOCAL INFILE './mariadb/csv/price.csv'
INTO TABLE `price`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;


LOAD DATA LOCAL INFILE './mariadb/csv/zone.csv'
INTO TABLE `zone`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/zone_loc.csv'
INTO TABLE `zone_loc`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY "'"
LINES
    TERMINATED BY '\r\n'
IGNORE 1 LINES
(zone_id, city_id, date_from, `geometry`)
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './mariadb/csv/speed_limit.csv'
INTO TABLE `speed_limit`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
;

SHOW WARNINGS;


LOAD DATA LOCAL INFILE './mariadb/csv/trip.csv'
INTO TABLE `trip`
CHARSET utf8
FIELDS
    TERMINATED BY ';'
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\r\n'
IGNORE 1 LINES
;

SHOW WARNINGS;


