FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN chmod +x ./node_modules/.bin/tsc
COPY . .
RUN ./node_modules/.bin/tsc
CMD ["node", "dist/main.js"] 