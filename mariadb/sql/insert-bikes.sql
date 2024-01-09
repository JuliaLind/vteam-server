-- To be used from docker-container.

LOAD DATA LOCAL INFILE './csv/employee.csv'
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


LOAD DATA LOCAL INFILE './csv/user.csv'
INTO TABLE `user`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(id, email, balance)
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './csv/user_card.csv'
INTO TABLE `user_card`
CHARSET utf8
FIELDS
    TERMINATED BY ','
    ENCLOSED BY '"'
LINES
    TERMINATED BY '\n'
IGNORE 1 LINES
(user_id, card_nr, card_type)
;

SHOW WARNINGS;

LOAD DATA LOCAL INFILE './csv/bike.csv'
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

LOAD DATA LOCAL INFILE './csv/payment.csv'
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



LOAD DATA LOCAL INFILE './csv/zone_loc.csv'
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



LOAD DATA LOCAL INFILE './csv/trip.csv'
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


