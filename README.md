# 바닐라 JS 프로젝트 성능 개선

- url: https://d1dxxe35ykrggl.cloudfront.net/

## 성능 개선 보고서

### 개선 전:

- https://pagespeed.web.dev/analysis/https-d1dxxe35ykrggl-cloudfront-net/5ndlfr7k01?form_factor=desktop

#### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 72%  | 🟠   |
| Accessibility  | 82%  | 🟠   |
| Best Practices | 75%  | 🟠   |
| SEO            | 82%  | 🟠   |
| PWA            | 0%   | 🔴   |

#### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                      | 측정값 | 상태 |
| ------ | ------------------------- | ------ | ---- |
| LCP    | Largest Contentful Paint  | 14.71s | 🔴   |
| INP    | Interaction to Next Paint | N/A    | 🟢   |
| CLS    | Cumulative Layout Shift   | 0.011  | 🟢   |

### 개선 후

#### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 100% | 🟢   |
| Accessibility  | 91%  | 🟢   |
| Best Practices | 93%  | 🟢   |
| SEO            | 91%  | 🟢   |
| PWA            | 0%   | 🔴   |

#### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                      | 측정값 | 상태 |
| ------ | ------------------------- | ------ | ---- |
| LCP    | Largest Contentful Paint  | 1.81s  | 🟢   |
| INP    | Interaction to Next Paint | N/A    | 🟢   |
| CLS    | Cumulative Layout Shift   | 0.001  | 🟢   |

### 개선 사항

- 이미지 최적화
  - jpg -> webp로 변경하여 이미지 용량 축소
  - 레이아웃 시프트 방지
  - 초기 렌더링 이미지를 picture 태그로 설정하여 불필요한 리소스 다운로드 예방
  - 이미지 lazy loading 적용
- 무거운 작업을 비동기로 분할 처리
- cookie consent 라이브러리 로드 오류 수정
- 접근성 개선
- 폰트 로딩 방식 개선
- meta 태그 추가
