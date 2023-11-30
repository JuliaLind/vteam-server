DROP DATABASE IF EXISTS `bikes`;
CREATE DATABASE `bikes`;
USE `bikes`;

source ./sql/ddl.sql;
-- source ./sql/insert-local.sql;
source ./sql/view.sql;
source ./sql/functions.sql;
source ./sql/sp_payment.sql;
source ./sql/sp_user.sql;


