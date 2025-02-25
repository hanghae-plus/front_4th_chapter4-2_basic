# Page Speed Insight
## 성능 최적화 전
<img width="1259" alt="image" src="https://github.com/user-attachments/assets/151c32c5-0fc1-4463-993a-f65edc1648c7" />

## 성능 최적화 후
<img width="1260" alt="image" src="https://github.com/user-attachments/assets/5a9980d9-a7cd-4d45-8371-fe971138b440" />

# Lighthouse 분석


# 🚀 웹 성능 최적화 전략

## 📦 프로젝트 성능 최적화 전략

### 1. 코드 번들 및 레이지 로딩 최적화
- Dynamic import를 활용한 모듈 지연 로딩
- `import()` 함수를 사용해 제품 모듈을 필요할 때만 로드
- 초기 페이지 로딩 속도 개선

### 2. 이벤트 위임(Event Delegation) 최적화
- 문서 레벨에서 단일 이벤트 리스너 사용
- 이벤트 버블링을 활용한 이벤트 처리 
- 메모리 사용 최적화 및 성능 향상

### 3. 이미지 로딩 최적화
- 프로그레시브 이미지 로딩 구현
- Intersection Observer API 활용
- 지연 로딩 및 뷰포트 기반 이미지 로드
- 블러 효과를 통한 이미지 로딩 UX 개선

### 4. 캐싱 전략
- SessionStorage를 활용한 API 응답 캐싱
- 중복 네트워크 요청 방지
- 애플리케이션 성능 및 사용자 경험 개선

### 5. 비동기 렌더링 최적화
- `requestIdleCallback()` 활용
- 브라우저의 유휴 시간을 활용한 DOM 조작
- 메인 스레드 차단 최소화

### 6. CSS 성능 최적화
- `will-change` 속성 선별 사용
- 레이아웃 재계산 최소화
- 하드웨어 가속 활용

### 7. 리소스 로딩 최적화
- 폰트 및 CSS 비동기 로딩
- `preload`, `preconnect` 사용
- 초기 페이지 로딩 속도 개선

### 8. 스크롤 및 렌더링 성능
- `content-visibility: auto` 활용
- 뷰포트 외부 콘텐츠 렌더링 지연
- 스크롤 성능 및 메모리 사용 최적화

### 9. 이미지 포맷 최적화
- WebP 이미지 형식 사용
- `<picture>` 태그를 통한 다중 이미지 포맷 지원
- 브라우저 호환성 및 이미지 로딩 성능 개선

### 10. 동적 콘텐츠 렌더링 최적화
- DocumentFragment 사용
- 한 번에 DOM에 요소 추가
- 리플로우 및 리페인트 최소화

## 🔍 주요 성능 지표
- 초기 로딩 속도 개선
- 메모리 사용 최적화
- 사용자 경험(UX) 향상
- 네트워크 요청 최소화

## 🛠 사용된 기술
- Intersection Observer API
- Dynamic Import
- SessionStorage
- WebP 이미지
- requestIdleCallback
- DocumentFragment

## 📈 성능 개선 효과
- 초기 로딩 시간 단축
- 불필요한 리소스 로딩 감소
- 메모리 사용 효율성 증가
- 사용자 인터랙션 반응성 향상
