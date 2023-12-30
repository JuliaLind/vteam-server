--
-- For local use. Different relative paths
-- to csv files compared to those used from container
--
-- Note that only some of the tables
-- are pre-populated in the database.
-- Tables that are tested for updates
-- are populated via js testing code
--

-- note, no first line to ignore in csv file
LOAD DATA LOCAL INFILE './csv/client_type.csv'
INTO TABLE `client_type`
CHARSET utf8
FIELDS
    TERMINATED BY '\r\n'
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\r\n'
;

-- note, no first line to ignore in csv file
LOAD DATA LOCAL INFILE './csv/keys.csv'
INTO TABLE `api_key`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\r\n'
(`client_type_id`,`key`)
;

LOAD DATA LOCAL INFILE './csv/city.csv'
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


LOAD DATA LOCAL INFILE './csv/card.csv'
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


LOAD DATA LOCAL INFILE './csv/status.csv'
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



LOAD DATA LOCAL INFILE './csv/price.csv'
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


LOAD DATA LOCAL INFILE './csv/zone.csv'
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


LOAD DATA LOCAL INFILE './csv/speed_limit.csv'
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


