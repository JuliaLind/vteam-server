DROP TABLE IF EXISTS `trip`;
DROP TABLE IF EXISTS `speed_limit`;
DROP TABLE IF EXISTS `zone_loc_removed`;
DROP TABLE IF EXISTS `zone_loc`;
DROP TABLE IF EXISTS `zone`;
DROP TABLE IF EXISTS `bike`;
DROP TABLE IF EXISTS `status`;
DROP TABLE IF EXISTS `city`;
DROP TABLE IF EXISTS `price`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `payment`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `card`;
DROP TABLE IF EXISTS `third_party`;
DROP TABLE IF EXISTS `api_key`;

CREATE TABLE `api_key` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `key` CHAR(32) NOT NULL,
    `active` BOOLEAN DEFAULT TRUE,
    `status_updated` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `key` (`key`)
);

--
-- For the system admin to keep track
-- of third paties with own API keys
--
CREATE TABLE `third_party` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `api_key_id` INT NOT NULL,
    `email` VARCHAR(200),

    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    FOREIGN KEY (`api_key_id`) REFERENCES `api_key` (`id`)
);

CREATE TABLE `card` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20),

    PRIMARY KEY (`id`)
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `card_nr` VARCHAR(100) NOT NULL,
    `card_type` INT NOT NULL,
    `balance` DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    FOREIGN KEY (`card_type`) REFERENCES `card` (`id`)
);

CREATE TABLE `payment`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ref` CHAR(8) NOT NULL,
    `amount` DECIMAL(7,2) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `hash` VARCHAR(100) NOT NULL,
    `role` VARCHAR(30) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
);



CREATE TABLE `price`(
    `id` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(5,2) NOT NULL,

    PRIMARY KEY (`id`)
);

CREATE TABLE `city`(
    `id` VARCHAR(10),
    `name` VARCHAR(40),
    `speed_limit` INT,
    `geometry` VARCHAR(10000),

    PRIMARY KEY (`id`)
);

CREATE TABLE `status`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `descr` VARCHAR(20),

    PRIMARY KEY (`id`)
);

CREATE TABLE `bike`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `city_id` VARCHAR(10),
    `status_id` INT NOT NULL DEFAULT 1,
    `charge_perc` DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    `coords` VARCHAR(100),
    `active` BOOLEAN NOT NULL DEFAULT TRUE,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
    FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
);

CREATE TABLE `zone`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `descr` VARCHAR(20),

    PRIMARY KEY (`id`)
);

CREATE TABLE `zone_loc`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `zone_id` INT NOT NULL,
    `city_id` VARCHAR(10),
    `date_from` DATETIME,
    `geometry` vARCHAR(10000),

    PRIMARY KEY (`id`),
    FOREIGN KEY (`zone_id`) REFERENCES `zone` (`id`),
    FOREIGN KEY (`city_id`) REFERENCES `city` (`id`)
);

CREATE TABLE `zone_loc_removed`(
    `zone_loc_id` INT,
    `date_to` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`zone_loc_id`),
    FOREIGN KEY (`zone_loc_id`) REFERENCES `zone_loc` (`id`)
);

CREATE TABLE `speed_limit`(
    `zone_id` INT NOT NULL,
    `speed` INT NOT NULL,

    PRIMARY KEY (`zone_id`),
    FOREIGN KEY (`zone_id`) REFERENCES `zone` (`id`)
);

CREATE TABLE `trip`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `bike_id` INT NOT NULL,
    `start_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_time` DATETIME,
    `start_pos` VARCHAR(100) NOT NULL,
    `end_pos` VARCHAR(100),
    `start_cost` DECIMAL(5,2),
    `var_cost` DECIMAL(5,2),
    `park_cost` DECIMAL(5,2),

    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    FOREIGN KEY (`bike_id`) REFERENCES `bike` (`id`)
);



