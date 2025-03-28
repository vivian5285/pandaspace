FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN chmod +x ./node_modules/.bin/nest
COPY . .
RUN npm run build
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3000/health || exit 1
EXPOSE 3000
CMD ["npm", "start"] 