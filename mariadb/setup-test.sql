-- DROP DATABASE IF EXISTS `test`;
-- CREATE DATABASE `test`;
USE `test`;

source ./docker-entrypoint-initdb.d/sql/ddl.sql;
source ./docker-entrypoint-initdb.d/sql/insert-test.sql;
source ./docker-entrypoint-initdb.d/sql/view.sql;

source ./docker-entrypoint-initdb.d/sql/functions.sql;
source ./docker-entrypoint-initdb.d/sql/sp_payment.sql;
source ./docker-entrypoint-initdb.d/sql/sp_user.sql;
source ./docker-entrypoint-initdb.d/sql/sp_emp.sql;
source ./docker-entrypoint-initdb.d/sql/sp_trip.sql;
source ./docker-entrypoint-initdb.d/sql/sp_bike.sql;
source ./docker-entrypoint-initdb.d/sql/sp_city.sql;
source ./docker-entrypoint-initdb.d/sql/sp_card.sql;
source ./docker-entrypoint-initdb.d/sql/sp_key.sql;
source ./docker-entrypoint-initdb.d/sql/triggers.sql;
