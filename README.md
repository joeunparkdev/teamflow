## 프로젝트 소개

- 프로젝트 명 : **프로젝트 협업 도구 만들기 (TeamFlow)**
- 소개
  - 한 줄 정리 : 트렐로와 유사한 협업 도구로, 사용자들이 프로젝트를 효과적으로 계획, 추적, 협업할 수 있도록 하는 웹 애플리케이션 만들기
- **사용자 관리 기능**
  - 로그인 / 회원가입 기능
  - 사용자 정보 수정 및 삭제 기능
- **보드 관리 기능**
  - 보드 생성
  - 보드 수정
    - 보드 이름
    - 배경 색상
    - 설명
  - 보드 삭제
    - 생성한 사용자만 삭제 가능
  - 보드 초대
    - 특정 사용자들을 해당 보드에 초대시켜 협업 가능
- **컬럼 관리 기능**
  - 컬럼 생성
    - 보드 내부에 컬럼을 생성 가능
    - 컬럼이란 위 사진에서 Backlog, In Progress와 같은 것을 의미
  - 컬럼 이름 수정
  - 컬럼 삭제
  - 컬럼 순서 이동
    - 컬럼 순서는 자유롭게 변경 가능
      - e.g. Backlog, In Progress, Done → Backlog, Done, In Progress
- **카드 관리 기능**
  - 카드 생성
    - 컬럼 내부에 카드를 생성 가능
  - 카드 수정
    - 카드 이름
    - 카드 설명
    - 카드 색상
    - 작업자 할당
    - 작업자 변경
  - 카드 삭제
  - 카드 이동
    - 같은 컬럼 내에서 카드의 위치를 변경 가능
    - 카드를 다른 컬럼으로 이동 가능
- **카드 상세 기능**
  - 댓글 달기
    - 협업하는 사람들끼리 카드에 대한 토론 가능
  - 날짜 지정
    - 카드에 마감일을 설정하고 관리 가능

## 환경변수

`.env` 파일 생성 후 아래 내용 입력

```
SERVER_PORT=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SYNC=
PASSWORD_HASH_ROUNDS=
JWT_SECRET=
REFRESH_SECRET=
email_service=
EMAIL_USER=
EMAIL_PASS=
```

## 실행 방법

```sh
npm install
npm run start:dev
```

## 설계 문서

- ERD: https://www.erdcloud.com/d/uwnZnwTKqGYdJmEP2

- API 명세서: https://www.notion.so/ef6f0fa160644d9c8e45fdfa819e6fac?v=01a53e2243fe47e2b1f8883d4c1c90a7&pvs=4

## Swagger 접속 주소

http://ec2-43-201-97-25.ap-northeast-2.compute.amazonaws.com:3000/api
