FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema ./apps/subscription/prisma/schema.prisma
EXPOSE 4002
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./apps/subscription/prisma/schema.prisma && npm run start:subscription:dev"]
