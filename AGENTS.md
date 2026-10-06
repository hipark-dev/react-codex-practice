# RepoLens 공통 개발 규칙

이 규칙은 RepoLens 프로젝트 전체에 적용한다.

1. React + TypeScript 기반으로 개발한다.
2. 함수형 컴포넌트를 사용한다.
3. TypeScript의 `any` 타입은 사용하지 않는다.
4. 컴포넌트 Props는 `interface`로 정의한다.
5. 전역 상태 관리는 Zustand를 사용한다.
6. API 통신은 Axios를 사용한다.
7. API 호출 로직은 `src/api` 디렉터리에 작성한다.
8. 공통 컴포넌트는 `src/components` 디렉터리에 작성한다.
9. 커스텀 Hook은 `src/hooks` 디렉터리에 작성한다.
10. 코드 수정 후 프로젝트 루트에서 `npm run lint`와 `npm run build`를 실행한다.
11. 기존 프로젝트 구조와 코딩 스타일을 최대한 유지한다.
12. 작업 완료 후 수정 파일과 검증 결과를 한국어로 보고한다.
