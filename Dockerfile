FROM node:10

# Create app directory
WORKDIR /code

# Install app dependencies
COPY package*.json ./

RUN npm ci --omit=dev

# Add src dir
RUN mkdir src

# Add configs dir
RUN mkdir configs

# Copy src code
COPY /src ./src

# Copy config files
COPY /configs ./configs

EXPOSE 9000

ENV DOCKER true

CMD [ "npm", "run", "prod" ]