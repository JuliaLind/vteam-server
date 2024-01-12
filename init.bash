#!/usr/bin/env bash
#
# Bash script for setting up the system
#
# Exit values:
#  0 on success
#  1 on failure
#

# Name of the script
SCRIPT=$( basename "$0" )

# Current version
VERSION="1.0.0"

#
# Message to display for usage and help.
#
function usage
{
    local txt=(
""
"Script $SCRIPT is used to work with log-data."
"Usage: $SCRIPT [options] <command> [arguments]"
""
"Commands:"
""
"   dev                  Start the containers in dev mode."
"   prod                 Start the containers in prod mode."
"   down                 Shut down the containers."
""
""
"Options:"
""
"   -h, --help      Display the menu"
"   -v, --version   Display the current version"
""
    )

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display when bad usage.
#
function badUsage
{
    local message="$1"
    local txt=(
"For an overview of the command, execute:"
"$SCRIPT -h, --help"
    )

    [[ -n $message ]] && printf "%s\\n" "$message"

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display for version.
#
function version
{
    local txt=(
"$SCRIPT version $VERSION"
    )

    printf "%s\\n" "${txt[@]}"
}

#
# Function to start the containers in development mode
#
function app-dev
{
    # Start the containers and enter the server container in bash
    docker-compose -f docker-compose.dev.yml up -d --build
    docker exec -it server bash
    docker-compose -f docker-compose.dev.yml down -v
}

#
# Function to start the containers in production mode
#
function app-prod
{
    # Start the containers
    docker-compose -f docker-compose.prod.yml up -d --build
}

#
# Function to shut down the container
#
function app-down
{
    # Container will be closed when exiting, but this will remove all imagess
    docker-compose -f docker-compose.prod.yml down -v --rmi all
}

#
# Process options
#
function main
{
    while (( $# ))
    do
        case "$1" in

            --help | -h)
                usage
                exit 0
            ;;

            --version | -v)
                version
                exit 0
            ;;

            dev            \
            | prod            \
            | down)
                command="$1"
                shift
                app-"$command" "$@"
                exit 0
            ;;

            *)
                badUsage "Option/command not recognized."
                exit 1
            ;;

        esac
    done

    badUsage
    exit 1
}

main "$@"
