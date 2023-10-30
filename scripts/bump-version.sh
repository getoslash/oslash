#!/usr/bin/env bash
# Script that updates the `version` field in a given set of JSON files to the given value.

set -e

if [[ -z $1 && -z $2 ]]; then
    echo "Usage: bump-version.sh <version> <file1> [file2] ... [fileN]"
    exit 1
fi

for filename in "${@:2}"
do
    # Remove -rc part from the version number
    # REFER: https://unix.stackexchange.com/a/257545
    VERSION_NUMBER=$(echo "$1" | sed 's/\-.*//')
    echo "⬆️ Bumping version to $VERSION_NUMBER in file $filename"
    npm_config_yes=true npx dot-json $filename version $VERSION_NUMBER
done
