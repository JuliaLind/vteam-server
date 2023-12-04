DROP DATABASE IF EXISTS `test`;
CREATE DATABASE `test`;
USE `test`;

source ./sql/ddl.sql;
source ./sql/insert-test.sql;
-- source ./sql/functions.sql;
source ./sql/view.sql;
source ./sql/triggers.sql;
source ./sql/functions2.sql;
source ./sql/sp_payment.sql;
source ./sql/sp_user.sql;
source ./sql/sp_emp.sql;
source ./sql/sp_trip.sql;
source ./sql/sp_bike.sql;
source ./sql/sp_city.sql;
source ./sql/sp_card.sql;