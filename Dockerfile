# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:14.19.0 as build

WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx

COPY --from=build app/dist/aula-remota-web /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# docker build -t aula-remota-web .
# docker run -p 8081:80 aula-remota-web
