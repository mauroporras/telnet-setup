#!/bin/bash

# Define the path to the repository folder
REPO_FOLDER="./git/telnet-setup/"

# Change directory to the repository folder
cd "$REPO_FOLDER"

# Pull the latest changes from GitHub
git pull

echo "update complete - review for errors"

sleep 5