# VTEAM - Server and REST API

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Code Coverage](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/badges/build.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/vteam-server/build-status/main)

## Introduction
This repository is a subsystem and contains an Express.js and Node.js server, serving data from a MariaDB database with mock data and a REST API for accessing the data. It is also a submodule of the VTEAM root repository [found here](https://github.com/p0ntan/vteam-root), which is a representation of the entire system. The system holds several subsystems including the bike brain, the server and API, a frontend GUI for administrators, a frontend GUI for users and a progressive webapp for users.

## Getting started
To be able to start the system successfully, you need to create two .env files. The .env.example files in the root of the repository and in the server directory reveal which env variables you should add to your own .env files.

Now you're all set.

Start the docker daemon on your computer, navigate to the root of the repository and run the following command:

```./init.bash```

To exit the system, just type ```exit``` whilst in the server container. This will shut down the containers and remove them from your computer.

## GitHub Secrets
If you want GitHub Actions to work properly, you need to add some variables to your GitHub secrets. Use the same variable names (and values) as in the .env file in the root of the repository.
