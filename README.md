# lighthouse 변화 지표

## 코드 분할 및 lazyloading

### 1. 코드 분할 (Code Splitting)
### 1. 코드 분할 (Code Splitting)

#### 모듈 시스템 도입
- 자바스크립트 파일을 ES6 모듈로 변환하여 필요할 때만 로드되도록 구성
- `main.js`는 초기 페이지 로드에 필요한 핵심 기능만 포함
- `products.js`는 동적으로 임포트되어 제품 목록이 필요할 때만 로드

#### 무거운 계산 분리
- 성능에 영향을 주는 무거운 계산 작업을 `worker.js`로 분리
- 웹 워커(Web Worker)를 사용하여 메인 스레드 차단을 방지
- 이를 통해 UI 반응성 유지 및 사용자 경험 향상

### 2. 레이지 로딩 (Lazy Loading)

#### 이미지 지연 로딩
- 모든 제품 이미지와 스크롤 시 볼 수 있는 콘텐츠 이미지에 `loading="lazy"` 속성 추가
- 초기 페이지 로드 시 필요한 이미지만 다운로드하여 초기 로드 시간 단축

#### 이벤트 리스너 지연 바인딩
- Intersection Observer API를 사용하여 요소가 화면에 나타날 때만 이벤트 리스너 추가
- 초기 페이지 로드 시 불필요한 이벤트 리스너를 줄여 메모리 사용량 및 성능 최적화

#### 제품 데이터 지연 로드
- `main.js`에서 제품 데이터가 필요할 때만 `products.js` 모듈을 동적으로 임포트
- 사용자가 실제로 필요로 하는 시점에 데이터를 로드하여 초기 로드 시간 단축

### 3. 추가 최적화

#### 리소스 사전 로드
- 중요한 리소스에 대한 `preload` 및 `preconnect` 힌트 추가
- 브라우저가 중요한 리소스를 더 빨리 로드할 수 있도록 우선순위 지정

#### 비동기 처리 개선
- `setTimeout`을 `requestIdleCallback`으로 대체하여 브라우저 유휴 시간에 작업 수행
- 이벤트 핸들러가 필요할 때만 등록되도록 리팩토링
- DocumentFragment 사용으로 DOM 조작 최소화

### 🎯 Lighthouse 점수
| 카테고리 | 점수 | 상태 |
|----------|------|------|
| Performance | 72% | 🟠 |
| Accessibility | 95% | 🟢 |
| Best Practices | 71% | 🟠 |
| SEO | 100% | 🟢 |
| PWA | 0% | 🔴 |

### 📊 Core Web Vitals (2024)
| 메트릭 | 설명 | 측정값 | 상태 |
|--------|------|--------|------|
| LCP | Largest Contentful Paint | 12.76s | 🔴 |
| INP | Interaction to Next Paint | N/A | 🟢 |
| CLS | Cumulative Layout Shift | 0.011 | 🟢 |

# Google Page Speed Insight 데이터
## 처음 Page Speed Insight
<img width="1259" alt="image" src="https://github.com/user-attachments/assets/151c32c5-0fc1-4463-993a-f65edc1648c7" />
