-- DROP DATABASE IF EXISTS `bikes`;
-- CREATE DATABASE `bikes`;
USE `bikes`;

source ./docker-entrypoint-initdb.d/sql/ddl.sql;
source ./docker-entrypoint-initdb.d/sql/insert.sql;
-- source ./sql/view.sql;
-- source ./sql/functions.sql;
-- source ./sql/sp_payment.sql;


