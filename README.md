# VTEAM - Database, server and REST API

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/build.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/build-status/main)

## Introduction
Welcome to our repository! This subsystem includes an Express.js and Node.js server that delivers data from a MariaDB database, enriched with mock data, and features a REST API for data access. It serves as a submodule of the VTEAM root repository, [available here](https://github.com/p0ntan/vteam-root), representing the larger ecosystem of our project. This comprehensive system encompasses various components, such as the bike brain, server and API, an administrative frontend GUI, a user-oriented frontend GUI, and a progressive web app for users.

## Prerequisites
To run the server, Docker and Docker Compose are essential. If you haven't installed Docker and Docker Compose, you can obtain them from [Docker's official website](https://www.docker.com/products/docker-desktop/). Docker Desktop conveniently bundles Docker Compose, Docker Engine, and Docker CLI – all essential tools for Docker Compose.

One of Docker's key advantages is its handling of dependencies, such as Node.js and MariaDB. By using Docker, you avoid the need to install these dependencies on your machine, as they are seamlessly integrated within the Docker environment.

## Getting started
To kickstart the system, you'll need to create a .env file. Refer to the .env.example file located in the repository's root for guidance on the necessary environment variables. Feel free to use the provided example values.

Once you're ready, initiate the Docker daemon on your computer, then head to the repository's root directory and execute the following command to enter docker development environment:

```./init.bash dev```

This command launches three Docker containers: two MariaDB containers (one housing a test database) and one server container. After all containers are up and running, with the MariaDB containers marked as 'healthy,' you'll enter the server container. To evaluate the server and browse the API documentation, visit localhost:1337/v1/docs.

Exiting the system is straightforward. Simply type exit while in the server container to halt the containers and remove them from your system.

There is also a docker production environment, which is is mainly used in the context of the complete system. If you want to assess the production environment, you can enter it with:

```./init.bash prod```

To shut down the production environment, use ```./init.bash down```.

## GitHub Secrets
For optimal GitHub Actions performance, you'll need to configure some variables in your GitHub secrets. Ensure these variables mirror the names and values found in the .env file at the repository's root.
