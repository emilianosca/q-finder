# web-app/Dockerfile

# Base stage
FROM node:20-slim AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

# Development Stage
FROM base AS dev

EXPOSE 3000
CMD ["pnpm", "dev"]

# Production Stage
FROM base AS build

RUN pnpm run build

FROM node:20-slim AS prod

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["pnpm", "start"]