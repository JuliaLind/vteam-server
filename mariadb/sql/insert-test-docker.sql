-- To be used from docker-container.
-- Different relative paths compared to
-- the local files
--
-- Note that only some of the tables
-- are pre-populated in the database.
-- Tables that are tested for updates
-- are populated via js testing code
--

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
