DROP DATABASE IF EXISTS `test`;
CREATE DATABASE `test`;
USE `test`;

source ./docker-entrypoint-initdb.d/sql/ddl.sql;
-- source ./docker-entrypoint-initdb.d/sql/insert.sql;


-- source ./sql/view.sql;
-- source ./sql/functions.sql;
-- source ./sql/sp_payment.sql;

-- \! mariadb -u root -p${MYSQL_ROOT_PASSWORD} -h localhost -P 3306 -e "source /docker-entrypoint-initdb.d/sql/ddl.sql"

-- -- Execute insert.sql file
-- \! mariadb -u root -p${MYSQL_ROOT_PASSWORD} -h localhost -P 3306 -e "source /docker-entrypoint-initdb.d/sql/insert.sql"

