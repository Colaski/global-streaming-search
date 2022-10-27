FROM node:lts-alpine

EXPOSE 8000/tcp

ADD . "/app"
WORKDIR /app

RUN npm install
RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]
