# 포트폴리오 홈페이지 프로젝트

## 프로젝트 개요
1년차 백엔드 개발자 김민우(CHISANW)의 포트폴리오 홈페이지

## 개인 정보
- 이름: 김민우
- 직군: 백엔드 개발자 (1년차)
- GitHub ID: CHISANW
- GitHub URL: https://github.com/CHISANW
- 이메일: keuye06380618@gmail.com
- 기술 스택: Java, Spring Boot, Kubernetes, Docker, MySQL, Redis, Elasticsearch

## 기술 스택
- React + Vite
- Tailwind CSS
- Framer Motion (애니메이션)

## 섹션 구성 (순서 고정)
1. **Hero** - 이름, 직군, 한줄소개, CTA 버튼
2. **About** - 상세 자기소개
3. **Skills** - 기술 스택 시각화 (백엔드 중심)
4. **Projects** - GitHub MCP로 레포 정보 자동 가져오기
5. **GitHub** - GitHub 잔디(contribution calendar) 표시
6. **Contact** - 연락처 및 소셜 링크

## 개발 규칙
- 컴포넌트는 `src/components/` 에 섹션별로 분리
- 모바일 반응형 필수 (mobile-first)
- 다크모드 지원 필수 (Tailwind dark: prefix 사용)
- 깔끔하고 모던한 디자인
- 한국어/영어 혼용 허용

## GitHub MCP 연동
- GitHub MCP 서버로 CHISANW 계정의 레포 목록 자동 가져오기
- Projects 섹션에 실제 레포 데이터(이름, 설명, 언어, 스타 수) 표시
- GitHub 잔디는 `github-contributions-api` 또는 GitHub GraphQL API 활용

## 디렉토리 구조
```
src/
  components/
    Hero.jsx
    About.jsx
    Skills.jsx
    Projects.jsx
    GitHubActivity.jsx
    Contact.jsx
    Navbar.jsx
  App.jsx
  main.jsx
```