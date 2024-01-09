DROP DATABASE IF EXISTS `bikes`;
CREATE DATABASE `bikes`;
USE `bikes`;

source ./sql/shared-pt1.sql;
source ./sql/insert-bikes.sql;
source ./sql/shared-pt2.sql;

