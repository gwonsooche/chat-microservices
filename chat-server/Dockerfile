# syntax=docker/dockerfile:1
FROM node:16.15.0
WORKDIR /
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3002