FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 1010

CMD [ "node", "index.js" ]
