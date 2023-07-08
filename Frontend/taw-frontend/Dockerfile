FROM node:12.18.1 AS build
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install && npm install typescript --save-dev

COPY . ./

RUN npm run build --prod

FROM nginx:1.21.0-alpine
COPY --from=build /app/dist/taw-frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]