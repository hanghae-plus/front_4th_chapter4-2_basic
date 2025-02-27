# 바닐라 JS 프로젝트 성능 개선 보고서

- **URL:** https://d18gzd9jk19h8u.cloudfront.net/

## Core Web Vitals

> Core Web Vitals는 웹사이트의 실제 사용자 경험을 평가하기 위해 Google에서 정의한 핵심 성능 지표입니다. 주요 목적은 사용자가 웹 페이지를 방문할 때의 로딩 속도, 상호작용 응답성, 그리고 시각적 안정성을 측정하는 것입니다.

### LCP (Largest Contentful Paint):

페이지에서 가장 큰 콘텐츠(예: 이미지, 텍스트 블록 등)가 완전히 렌더링되는 시간을 측정합니다.
빠른 LCP는 사용자에게 빠른 페이지 로딩 인상을 줍니다.

### FID (First Input Delay):

사용자가 페이지와 처음 상호작용할 때(예: 버튼 클릭) 발생하는 지연 시간을 측정합니다.
짧은 FID는 사용자가 페이지와 빠르게 상호작용할 수 있도록 도와줍니다.

### CLS (Cumulative Layout Shift):

페이지 로딩 중 예기치 않은 레이아웃 이동(예: 이미지나 버튼의 위치 변화)이 얼마나 발생하는지를 측정합니다.
낮은 CLS는 안정적인 레이아웃을 제공하여 사용자 경험을 향상시킵니다.

## 사전 지표 (개선 전)

### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 72%  | 🟠   |
| Accessibility  | 82%  | 🟠   |
| Best Practices | 75%  | 🟠   |
| SEO            | 82%  | 🟠   |
| PWA            | 0%   | 🔴   |

### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                                             | 측정값 | 상태 |
| ------ | ------------------------------------------------ | ------ | ---- |
| LCP    | Largest Contentful Paint (주요 콘텐츠 로딩 시간) | 14.71s | 🔴   |
| INP    | Interaction to Next Paint (사용자 입력 응답성)   | N/A    | 🟢   |
| CLS    | Cumulative Layout Shift (레이아웃 안정성)        | 0.011  | 🟢   |

## 1. 개선 이유

- **LCP 지표 문제 (주요 콘텐츠 로딩 지연):**  
  초기 LCP 값이 14.71초로, 핵심 콘텐츠가 사용자에게 표시되기까지 과도한 지연이 발생하였습니다. 이는 사용자 경험에 부정적인 영향을 미치며, 이탈률 증가 및 SEO 순위 저하로 이어질 수 있습니다.

- **전체 Lighthouse 점수:**  
  Performance(72%), Accessibility(82%), Best Practices(75%), SEO(82%) 등 전반적인 점수가 낮아, 특히 Critical Rendering Path 최적화와 리소스 로딩 효율 개선이 요구됩니다.

## 2. 개선 방법 및 기술적 접근

### 2.1 LCP 및 핵심 성능 지표 개선

- **이미지 최적화 및 반응형 이미지 제공:**

  - **WebP 포맷 전환:**  
    기존 JPEG 이미지 대신 WebP 포맷을 적용하여 파일 용량을 대폭 줄였습니다.  
    구형 브라우저 호환을 위해 `<picture>` 태그를 활용하여 여러 포맷을 제공했습니다.

    ```html
    <picture>
      <source srcset="images/vr1.webp" type="image/webp" />
      <img src="images/vr1.jpg" alt="product: Penom Case" />
    </picture>
    ```

  - **반응형 이미지 제공:**  
    뷰포트에 따라 적절한 해상도의 이미지만 로드되도록 하여, 불필요한 리소스 소모를 줄임으로써 LCP 개선에 기여하였습니다.

    ```html
    <section class="hero">
      <picture>
        <!-- 모바일: 최대 576px -->
        <source
          width="576"
          height="576"
          media="(max-width: 576px)"
          srcset="images/Hero_Mobile.webp"
          type="image/webp"
        />
        <source
          width="576"
          height="576"
          media="(max-width: 576px)"
          srcset="images/Hero_Mobile.jpg"
          type="image/jpeg"
        />

        <!-- 태블릿: 최대 960px -->
        <source
          width="960"
          height="770"
          media="(max-width: 960px)"
          srcset="images/Hero_Tablet.webp"
          type="image/webp"
        />
        <source
          width="960"
          height="770"
          media="(max-width: 960px)"
          srcset="images/Hero_Tablet.jpg"
          type="image/jpeg"
        />

        <!-- 데스크탑: 기본으로 WebP 우선 -->
        <source
          width="1920"
          height="893"
          srcset="images/Hero_Desktop.webp"
          type="image/webp"
        />
        <img
          width="1920"
          height="893"
          src="images/Hero_Desktop.jpg"
          alt="Hero image"
        />
      </picture>
    </section>
    ```

  - **Lazy Loading:**  
    사용자가 현재 볼 필요가 없는 이미지에 대해서는 lazy-loading을 적용하여 초기 로딩 시간을 단축시켰습니다.

    ```js
    const img = document.createElement("img");
    img.loading = "lazy";
    ```

- **자원 로딩 최적화 및 Critical Rendering Path 개선:**

  - **번들 최적화:**  
    Vite를 적용하여 자바스크립트 및 CSS 번들의 크기를 축소하고, 불필요한 코드를 제거함으로써 초기 렌더링 시간을 단축하였습니다.

  - **비동기 및 지연 로딩:**  
    `<script>` 태그에 `defer`와 `async` 속성을 사용하여 렌더링 차단 리소스를 최소화하였습니다.

    ```html
    <script defer src="app.js"></script>
    <script async src="analytics.js"></script>
    ```

  - **Web Worker 활용:**  
    메인 스레드의 부담을 줄이기 위해, 무거운 연산 작업은 Web Worker로 분리하여 비동기 처리하였습니다.

    ```js
    // products.js
    import Worker from "./worker.js?worker";

    const worker = new Worker();
    worker.postMessage({ action: "compute" });

    // worker.js
    self.onmessage = (event) => {
      const data = event.data;
      if (data.action === "compute") {
        for (let i = 0; i < 10_000_000_000; i++) {
          const temp = Math.sqrt(i) * Math.sqrt(i);
        }
      }
    };
    ```

- **서버 및 네트워크 최적화:**

  - **CDN 및 캐싱 전략:**  
    CloudFront를 활용하여 정적 리소스의 캐싱 정책을 강화하고, 서버 응답 시간을 단축시켜 전체 성능 개선에 기여하였습니다.

- **레이아웃 안정성 개선 (CLS 최적화):**
  - **폰트 및 UI 업데이트 최적화:**  
    `font-display: fallback` 설정과 UI 업데이트의 지연 처리(`setTimeout`)를 통해 레이아웃 이동을 최소화, CLS 수치를 0.011에서 0.000으로 낮추어 시각적 안정성을 확보하였습니다.

### 2.2 접근성 및 SEO 최적화

- **접근성 강화:**

  - 적절한 대체 텍스트를 통해 접근성을 강화하였습니다.

- **SEO 최적화:**
  - 메타 태그를 적용하여 검색 엔진 최적화(SEO)를 강화함으로써 검색 순위에 긍정적인 영향을 주도록 하였습니다.

## 3. 개선 후 향상된 지표

### 🎯 Lighthouse 점수

| 카테고리       | 점수 | 상태 |
| -------------- | ---- | ---- |
| Performance    | 99%  | 🟢   |
| Accessibility  | 91%  | 🟢   |
| Best Practices | 93%  | 🟢   |
| SEO            | 100% | 🟢   |
| PWA            | 0%   | 🔴   |

### 📊 Core Web Vitals (2024)

| 메트릭 | 설명                      | 측정값 | 상태 |
| ------ | ------------------------- | ------ | ---- |
| LCP    | Largest Contentful Paint  | 2.12s  | 🟢   |
| INP    | Interaction to Next Paint | N/A    | 🟢   |
| CLS    | Cumulative Layout Shift   | 0.000  | 🟢   |

### 요약

| 항목               | 개선 전     | 개선 후 (실제) | 개선율        |
| ------------------ | ----------- | -------------- | ------------- |
| **LCP**            | 14.71s (🔴) | 2.12s          | 약 85.6% 감소 |
| **Performance**    | 72% (🟠)    | 99%            | 약 37.5% 증가 |
| **Accessibility**  | 82% (🟠)    | 91%            | 약 11% 증가   |
| **Best Practices** | 75% (🟠)    | 93%            | 약 24% 증가   |
| **SEO**            | 82% (🟠)    | 100%           | 약 22% 증가   |

## 4. 기타 및 향후 계획

- **백엔드 개선 작업:**  
  API를 통해 전송되는 이미지의 압축 및 최신 포맷 적용 작업을 추가로 진행할 예정입니다.

- **모니터링 및 유지보수:**
  - Google Analytics 및 기타 실시간 모니터링 도구를 도입하여 성능 추이를 지속적으로 감시합니다.
  - 주기적인 재측정을 통해 Core Web Vitals 및 전체 성능 개선 효과를 평가하고, 추가 업데이트 계획을 수립할 예정입니다.
