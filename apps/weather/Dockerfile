FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/weather ./apps/weather
RUN npm ci
COPY ./apps/weather/. .
EXPOSE 4001
CMD ["npm", "run", "start:weather:dev"]