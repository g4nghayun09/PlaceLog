# 📍 PlaceLog

장소에 대한 기록을 사진과 함께 남기고, 다른 사람의 장소 기록을 둘러보며 좋아요를 누를 수 있는 장소 기록 공유 서비스입니다.

## 주요 기능

- **회원** : 회원가입 / 로그인 / 로그아웃 / 아이디 중복 확인 (세션 기반 인증)
- **게시물** : 장소 기록 작성 · 조회 · 수정 · 삭제 (제목, 내용, 장소명, 주소, 위도/경도, 카테고리, 여러 장의 이미지)
- **이미지 업로드** : 여러 장 동시 업로드 (파일당 최대 10MB)
- **좋아요** : 게시물 좋아요 / 취소, 좋아요 여부 확인
- **카테고리** : 카테고리별 게시물 분류
- **마이페이지** : 내가 쓴 글, 내가 좋아요한 글 모아보기

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Frontend | React 19, Vite, React Router 7, Axios, lucide-react |
| Backend | Java 17, Spring Boot 4.1, Spring Data JPA, Spring Validation, Lombok |
| Security | spring-security-crypto (비밀번호 암호화) |
| Database | MySQL |

## 프로젝트 구조

```
placeLog
├── backend                      # Spring Boot 서버
│   └── src/main/java/com/placelog/backend
│       ├── user                 # 회원가입 / 로그인
│       ├── post                 # 게시물 CRUD
│       ├── image                # 이미지 업로드
│       ├── like                 # 좋아요
│       ├── category             # 카테고리
│       ├── mypage               # 마이페이지
│       ├── WebConfig.java       # CORS, 업로드 이미지 정적 서빙
│       └── GlobalExceptionHandler.java
└── frontend/my-app              # React 클라이언트
    └── src
        ├── pages                # Main, Login, Signup, PostWrite, PostDetail, MyPage
        ├── components           # Header, Footer, PostCard, AuthLayout
        ├── styles               # 페이지/컴포넌트별 CSS
        └── api.js               # Axios 인스턴스
```

## 시작하기

### 사전 준비

- JDK 17 이상
- Node.js (LTS 권장)
- MySQL

### 1. 데이터베이스

`placelog` 데이터베이스를 생성합니다.

```sql
CREATE DATABASE placelog DEFAULT CHARACTER SET utf8mb4;
```

> `ddl-auto`가 `none`으로 설정되어 있어 **테이블은 직접 생성**해야 합니다.
> 엔티티는 `users`, `category`, `post`, `post_image`, `likes` 테이블을 사용합니다. 정확한 테이블/컬럼명은 `backend/src/main/java/com/placelog/backend` 하위 엔티티 클래스를 참고하세요.

### 2. 백엔드 설정 및 실행

DB 계정 정보는 Git에 올라가지 않는 `backend/src/main/resources/application-secret.yml` 파일에 작성합니다.

```yaml
DB_USERNAME: your_username
DB_PASSWORD: your_password
```

```bash
cd backend
./gradlew bootRun        # Windows: gradlew.bat bootRun
```

서버는 `http://localhost:8080` 에서 실행됩니다. 업로드된 이미지는 실행 위치의 `uploads/` 폴더에 저장되며 `/uploads/**` 로 제공됩니다.

### 3. 프론트엔드 실행

```bash
cd frontend/my-app
npm install
npm run dev
```

`http://localhost:5173` 에서 확인할 수 있습니다. API 주소는 [api.js](frontend/my-app/src/api.js)의 `baseURL`(`http://localhost:8080/api`)에서 변경합니다.

## API

모든 경로는 `/api` 로 시작하며, 세션 쿠키를 사용합니다.

| Method | Endpoint | 설명 |
| --- | --- | --- |
| POST | `/users/signup` | 회원가입 |
| POST | `/users/login` | 로그인 |
| POST | `/users/logout` | 로그아웃 |
| GET | `/users/me` | 현재 로그인 사용자 조회 |
| GET | `/users/check` | 아이디 중복 확인 |
| GET | `/posts` | 게시물 목록 |
| POST | `/posts` | 게시물 작성 |
| GET | `/posts/{postId}` | 게시물 상세 |
| PUT | `/posts/{postId}` | 게시물 수정 |
| DELETE | `/posts/{postId}` | 게시물 삭제 |
| POST | `/posts/{postId}/like` | 좋아요 / 취소 |
| GET | `/posts/{postId}/like` | 좋아요 여부 조회 |
| POST | `/images` | 이미지 업로드 (`files` 멀티파트) |
| GET | `/categories` | 카테고리 목록 |
| GET | `/me/posts` | 내가 쓴 글 |
| GET | `/me/likes` | 내가 좋아요한 글 |

## 화면 라우팅

| 경로 | 페이지 |
| --- | --- |
| `/` | 메인 (게시물 목록) |
| `/login`, `/signup` | 로그인, 회원가입 |
| `/write` | 게시물 작성 |
| `/posts/:postId` | 게시물 상세 |
| `/posts/:postId/edit` | 게시물 수정 |
| `/mypage` | 마이페이지 |
