#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
BASE_DIR=$(cd "${HERE}/.." && pwd)

cd ${BASE_DIR}

echo "Sure to release new version (y/N)? "
read -p ">> " answer

case ${answer:0:1} in
    y|Y )
        npm run taggit
        npm publish .
        npm run versionup
        git add . -A
        git commit -m 'Version up '
        git push
    ;;
    * )
        echo aborted.
    ;;
esac