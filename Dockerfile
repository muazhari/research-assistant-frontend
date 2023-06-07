FROM node:latest

WORKDIR /app
COPY . .

RUN yarn global add serve
RUN yarn install
