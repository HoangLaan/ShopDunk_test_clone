FROM node:16
RUN apt-get update && apt-get install -y \
    vim \
    telnet \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
# Create app directory
WORKDIR /usr/src/api
COPY . /usr/src/api
RUN yarn install --production --ignore-engines
EXPOSE 3001
CMD [ "node", "index.js" ]