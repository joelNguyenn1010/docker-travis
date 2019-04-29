FROM node:8.16
WORKDIR '/node'
COPY ./package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "dev"]