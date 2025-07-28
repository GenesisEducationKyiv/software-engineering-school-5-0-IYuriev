FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/email ./apps/email
RUN npm ci
COPY ./apps/email/. .
EXPOSE 4000
CMD ["npm", "run", "start:email:dev"]