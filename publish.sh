#!/bin/sh

GH_TOKEN = "ca15a53e55d2c205b0188c4c57508dc1eb169f11"


if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    echo "See README.md for more details."
    exit 1
fi

# This will build, package and upload the app to GitHub.
node_modules/.bin/build --win -p always

pause