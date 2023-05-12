cd "$(dirname "$0")/.." || exit

./scripts/build.sh

node ./scripts/deploy-commands.js
