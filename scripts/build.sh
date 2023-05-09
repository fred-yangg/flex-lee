cd "$(dirname "$0")/.." || exit

rm -rf ./app/build

npx tsc --project tsconfig.json
