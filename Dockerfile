# 빌드 단계
FROM node:20-alpine AS build-stage

WORKDIR /app

# 종속성 설치를 위해 package.json과 package-lock.json 복사
COPY package*.json ./

RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 실행 단계 (Nginx)
FROM nginx:stable-alpine AS production-stage

# 빌드된 정적 파일을 Nginx의 html 디렉토리로 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx 기본 설정 사용 (필요시 커스텀 설정 추가 가능)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
