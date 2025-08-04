# PBL AMC GIC F2-01 Project

이 프로젝트는 Replit에서 개발된 웹 애플리케이션입니다.

## 환경 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_SUPABASE_URL=https://hokwescexyufkisxulqe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhva3dlc2NleHl1Zmtpc3h1bHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NjIxNjAsImV4cCI6MjA2OTMzODE2MH0.SS9wztt7rOzsGYwDG_ozPKVYctCylvK32RwwmME2t2I
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 배포

### Vercel 배포

1. Vercel에 프로젝트를 연결
2. 환경변수를 Vercel 대시보드에서 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 자동 배포가 설정됩니다

## 기술 스택

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase
- **Deployment**: Vercel

## 프로젝트 구조

```
├── client/          # React 프론트엔드
├── server/          # Express 백엔드
├── shared/          # 공유 스키마
├── uploads/         # 업로드된 파일들
└── dist/           # 빌드 결과물
``` 