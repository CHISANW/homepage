FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_RSS_PROXY_URL
ARG VITE_API_URL
ENV VITE_RSS_PROXY_URL=$VITE_RSS_PROXY_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build-stage /app/dist ./dist
EXPOSE 3005
CMD ["serve", "-s", "dist", "-l", "3005"]