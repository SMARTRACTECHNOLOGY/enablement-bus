FROM: node:latestc

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Copy source dependancies
COPY package.json /usr/src/app
Copy index.js /usr/src/app

# Install
RUN npm install

EXPOSE 8080

# Run app
CMD [ "npm", "run", "dev" ]
