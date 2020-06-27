FROM node:10-alpine
WORKDIR /application
COPY package*.json /application/
RUN npm install --production
COPY ./views /application/views
COPY index.js /application
EXPOSE 3000
CMD npm start