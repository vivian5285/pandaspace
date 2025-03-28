FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN chmod +x ./node_modules/.bin/nest
COPY . .
RUN npm run build
EXPOSE 3000
RUN ./node_modules/.bin/nest build
