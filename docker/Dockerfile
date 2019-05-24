FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install && npm run build
EXPOSE 3000/tcp
