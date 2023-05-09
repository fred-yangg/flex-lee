cd "$(dirname "$0")/.." || exit

./scripts/build.sh

node ./app/build/index.js