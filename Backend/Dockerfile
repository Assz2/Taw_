FROM node:12.18.1

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install && npm install typescript --save-dev

COPY . dist/ ./

CMD [ "node", "index.js" ]
