FROM node:18-alpine

WORKDIR /app
RUN chmod -R 777 ./

COPY ./package.json .

RUN npm cache clean --force
RUN npm install

COPY . .

RUN apk add --no-cache git
RUN apk add --no-cache bash
RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 80 3000
