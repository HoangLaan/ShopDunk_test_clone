FROM node:12

ENV PORT 3000

# Create app directory
WORKDIR /app

COPY . /app

# Installing dependencies
RUN npm install
# RUN npm install -g node-gyp
# RUN npm install bcrypt

EXPOSE ${PORT}

# RUN cat api.js
CMD ["node", "index.js"]    
  