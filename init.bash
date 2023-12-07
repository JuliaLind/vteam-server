#!/usr/bin/env bash

docker-compose up -d --build

docker exec -it server bash

docker-compose down -v




# docker exec -it mariadb-bikes bash
# mariadb -u root -p