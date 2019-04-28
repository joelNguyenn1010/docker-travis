FROM node:8.16 AS builder
WORKDIR /node
COPY ./package.json ./
COPY . .
RUN npm i
RUN npm run build
RUN npm run prod

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /node/out /usr/share/nginx/html