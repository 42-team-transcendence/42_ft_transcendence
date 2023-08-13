#!/bin/bash

npm install

# After the dependencies are installed, the exec command replaces itself with 
# the command and arguments provided when executing the script.
# This allows you to use the script as a wrapper for other commands, 
# ensuring that the Node.js dependencies are installed before the main command is executed.
# "$@": This special construct represents all the arguments passed to the script
exec "$@"
