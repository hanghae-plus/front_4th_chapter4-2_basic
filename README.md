# 바닐라 JS 프로젝트 성능 개선

-   url: https://d3895ewzxkx7pt.cloudfront.net

## 성능 개선 보고서

### 기존 성능 측정 결과

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
| LCP    | Largest Contentful Paint  | 14.56s | 🔴   |
| INP    | Interaction to Next Paint | N/A    | 🟢   |
| CLS    | Cumulative Layout Shift   | 0.011  | 🟢   |

### 성능 개선 방법

| 개선 항목     | 상세                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| 접근성        | 1. `meta` 태그 추가 <br> 2. 대체 텍스트 작성                                                 |
| 쿠키 스크립트 | 1. `defer` 키워드 추가 <br> 2. 쿠키동의 배너 설정 수정                                       |
| 폰트 최적화   | 1. 프리커넥트 사용 <br> 2. 미디어 속성과 onload 활용 <br> 3. `noscript` 태그 추가            |
| 이미지 최적화 | 1. 이미지 포맷 변경(webp) <br> 2. <picture> 태그 사용 <br> 3. `img`태그의 lazy 속성으로 추가 |

#### 참고

### 최종 성능 측정 결과
