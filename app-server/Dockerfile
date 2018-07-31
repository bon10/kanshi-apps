FROM node:6

WORKDIR /usr/src/app
ADD . $PWD

RUN npm install

ENV NODE_PATH /usr/local/lib/node_modules
ENTRYPOINT ["node", "index.js"]

