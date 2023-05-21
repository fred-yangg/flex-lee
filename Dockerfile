FROM node:19

WORKDIR /flex-lee

COPY package*.json ./

RUN npm install

COPY . .

RUN ./scripts/build.sh

CMD ["node", "./app/build/index.js"]
