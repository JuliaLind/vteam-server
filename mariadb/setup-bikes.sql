-- DROP DATABASE IF EXISTS `bikes`;
-- CREATE DATABASE `bikes`;
USE `bikes`;

source ./docker-entrypoint-initdb.d/sql/ddl.sql;
source ./docker-entrypoint-initdb.d/sql/insert.sql;
source ./docker-entrypoint-initdb.d/sql/view.sql;
source ./docker-entrypoint-initdb.d/sql/functions.sql;
source ./docker-entrypoint-initdb.d/sql/sp_payment.sql;
source ./docker-entrypoint-initdb.d/sql/sp_user.sql;


