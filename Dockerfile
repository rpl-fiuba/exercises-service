FROM node:10
ADD . /code
WORKDIR /code
RUN npm install
EXPOSE 9000
ENV DOCKER=true
CMD ["npm", "run", "start"]
