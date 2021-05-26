FROM node:10.16.3

RUN apt update && apt install -y openjdk-8-jdk
# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Exports
EXPOSE 3000

CMD ["npm","start"]