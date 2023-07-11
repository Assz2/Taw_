# Stage 1: Build Angular app
FROM node:12.18.1 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app
COPY . .

# Build app
RUN npm run build

# Stage 2: Serve Angular app with nginx
FROM nginx:1.19.0-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
