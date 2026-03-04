# 빌드 단계
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 실행 단계
FROM node:20-alpine AS production-stage
WORKDIR /app
RUN npm install -g serve
COPY --from=build-stage /app/dist ./dist
EXPOSE 3005
CMD ["serve", "-s", "dist", "-l", "3005"]