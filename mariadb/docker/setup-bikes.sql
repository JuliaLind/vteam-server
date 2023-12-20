DROP DATABASE IF EXISTS `bikes`;
CREATE DATABASE `bikes`;
USE `bikes`;


source ./mariadb/sql/ddl.sql;
source ./mariadb/sql/insert-bikes-docker.sql;
source ./mariadb/sql/view.sql;
source ./mariadb/sql/functions.sql;
source ./mariadb/sql/sp_payment.sql;
source ./mariadb/sql/sp_user.sql;
source ./mariadb/sql/sp_emp.sql;
source ./mariadb/sql/sp_trip.sql;
source ./mariadb/sql/sp_bike.sql;
source ./mariadb/sql/sp_city.sql;
source ./mariadb/sql/sp_card.sql;
source ./mariadb/sql/sp_key.sql;
source ./mariadb/sql/triggers.sql;
