FROM node:18

WORKDIR /server

COPY ./server/package*.json ./

RUN npm install

EXPOSE 1337

CMD [ "npx", "nodemon", "app.js" ]
