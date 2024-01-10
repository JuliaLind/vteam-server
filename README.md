# VTEAM - Server and REST API

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/build.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/build-status/main)

## Introduction
This repository is a subsystem and contains an Express.js and Node.js server, serving data from a MariaDB database with mock data and a REST API for accessing the data. It is also a submodule of the VTEAM root repository [found here](https://github.com/p0ntan/vteam-root), which is a representation of the entire system. The system holds several subsystems including the bike brain, the server and API, a frontend GUI for administrators, a frontend GUI for users and a progressive webapp for users.

## Prerequisites
You need Docker and Docker Compose to be able to run the server. If you do not have Docker and Docker Compose installed, do so by visiting https://www.docker.com/products/docker-desktop/. Docker Desktop includes Docker Compose along with Docker Engine and Docker CLI which are Compose prerequisites.

Docker is handling the dependencies like Node.js and MariaDB. The benefit of using Docker is that it eliminates the need to install these dependencies on the your local machine, as they are encapsulated within the Docker environment.

## Getting started
To be able to start the system successfully, you need to create a .env file. The .env.example file in the root of the repository reveals which env variables you should add to your own .env file. You can use the values too.

Now you're all set.

Start the Docker daemon on your computer, navigate to the root of the repository and run the following command:

```./init.bash```

This command starts three containers. Two mariadb containers (one of which holds a test database) and a server container. When all containers are started and the mariadb containers are marked as healthy, you will enter the server container. To test the server and the same time see the API documentation, visit ```localhost:1337/v1/docs```.

To exit the system, just type ```exit``` whilst in the server container. This will shut down the containers and remove them from your computer.

## GitHub Secrets
If you want GitHub Actions to work properly, you need to add some variables to your GitHub secrets. Use the same variable names (and values) as in the .env file in the root of the repository.
