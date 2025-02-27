# 바닐라 JS 프로젝트 : 성능 개선 보고서
> url: https://front-4th-chapter4-2-basic-one.vercel.app/

## 1. 프로젝트 배포

프로젝트 배포는 Vercel로 진행하였습니다.
![](https://velog.velcdn.com/images/jmlee9707/post/b1ea859b-165e-4ee4-b9f5-5c9c27b7133b/image.png)

![](https://velog.velcdn.com/images/jmlee9707/post/dbe8df72-865d-4f4a-8738-67cccbe8be68/image.png)


1. local 환경에서 github으로 push
2. GitHub 저장소에 코드가 push되면 두 가지 자동화 프로세스가 트리거
	- Vercel에서 자동 배포 시작
	- GitHub Workflow 실행
3. GitHub Workflow는 작업 수행 후, GitHub 이슈 생성

## 2. 초기 성능 측정 및 분석

> 성능측정을 위해 Github 이슈에 작성한 `lighthouse`,`Page Speed Insights` 를 사용하였습니다.

### 🎯 Lighthouse 점수
| 카테고리 | 점수 | 상태 |
|----------|------|------|
| Performance | 72% | 🟠 |
| Accessibility | 82% | 🟠 |
| Best Practices | 93% | 🟢 |
| SEO | 82% | 🟠 |
| PWA | 0% | 🔴 |


### 👀 PageSpeed Insights (데스크탑)
 ![screenshot](https://velog.velcdn.com/images/jmlee9707/post/d6970bea-c19b-4519-abca-f5969747a903/image.png)


### 📊 성능 분석 및 개선 방안 

#### 🎯 1. Performance (72%) → 🚀 개선 필요

📌 문제점
- Largest Contentful Paint (LCP) 지연: 페이지의 최대 페인트 요소 렌더링이 느림.
- Cumulative Layout Shift (CLS) 문제: 대규모 레이아웃 변경이 발생하여 사용 경험 저하.
- 사용하지 않는 자바스크립트가 많음
- 렌더링 차단 리소스가 존재


#### 🎯2. Accessibility (82%) → ✅ 향상 필요

📌 문제점

- 이미지 요소에 width, height 명시되어 있지 않음

#### 🎯 3. Best Practices (93%) → ✅ 양호

📌 문제점

- 불필요한 자바 스크립트, css 가 존재 (불필요한 리소스을 줄이면 브라우저 렌더링 속도 개선)

##### 🎯 4. SEO (82%) → ✅ 개선 필요

📌 문제점

- 이미지의 alt 속성 누락
- 이미지 크기 (SEO에서는 이미지 로딩 속도가 검색 엔진 최적화에 영향을 미침)


<br />

## 3. 성능 개선

> 2. 의 분석을 바탕으로 개선할 기능을 정했고 코드 개선 작업을 진행했다.

### 3-1. 로컬 폰트 사용

- 속도와 접근성을 중시한다면 로컬 폰트가 더 유리하기에 웹사이트에서 웹 폰트로 사용되고 있던 것을 로컬 폰트로 변경하였다.
- 불필요한 리소스를 줄이기 위해 웹 프로젝트에서 사용되고 있는 font-weight 만을 웹링크에서 다운받아 사용하였다.



#### AS-IS
```html
 <link href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" rel="stylesheet">
```

#### TO-BE
```css
/* styles.css */
@font-face {
  font-family: "Heebo";
  src: url("fonts/Heebo-Regular.ttf") format("truetype");
  font-display: swap;
  font-weight: 400;
  font-style: normal;
}
```

<br />

### 3-2. 이미지 포맷 변경, 속성 변경

- 기존에 사용하던 JPG 이미지를 WebP 포맷으로 변경하였다
  - WebP는 손실 및 손실 없는 압축을 모두 지원하는 이미지 포맷으로 고화질의 이미지를 작은 파일 크기로 압축할 수 있는 것이 가장 큰 특징이다.
  - 웹 페이지의 로딩 시간을 단축하고, 데이터 사용량을 줄일 수 있다
- 대체 텍스트를 보여주는 `alt` 속성을 추가하였다.
- 누락되었던 이미지의 `width`, `height` 속성을 추가하였다.
- 추가로, `media` 속성을 추가하여 대규모 레이아웃 변경이 발생하는 **CLS** 를 개선하였다


<br />

### 3-3. 이미지 지연 로딩, 프로그레시브 기법 추가

- `<img>` 태그에 **loading="lazy"** 속성을 추가하여 페이지 안에 있는 실제 이미지들이 실제로 화면에 보여질 필요가 있을 때 로딩을 할 수 있도록 하였다.
- Desktop 에서 LCP 수치가 낮았던 이유는, 최상단에 위치한 이미지가 크기 때문이라고 생각했기에 프로그레시브 이미지 로딩 기법을 적용하였다
  - 프로그레시브 기법은 저해상도의 이미지를 먼저 로드하고 이후 원본 이비지를 비동기적으로 로드하는 방법이다.
  - (mobile, tablet 이미지 보다 desktop 파일이 상대적으로 크기가 컸기에 우선적으로 적용했다. => 추후 나머지도 개선하면 좋을 듯하다.)


```html
 <img
          class="desktop progressive-image"
          data-src="images/low-res-desktop.webp"
          src="images/Hero_Desktop.webp"
          alt="hero: desktop image"
          width="1920"
          height="893"
        />
```
```js
function loadHighResImage(img) {
  const highResSource = img.dataset.src;
  if (highResSource) {
    img.src = highResSource;
    img.classList.add("loaded");
    img.removeAttribute("data-src");
  }
}

function preloadLowQualityImage() {
  const images = document.querySelectorAll("img.progressive-image.desktop");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadHighResImage(entry.target);
        obs.unobserve(entry.target);
      }
    });
  });

  images.forEach((img) => observer.observe(img));
}

```

### 3-4. 이미지 압축

- 리소스를 줄이고, FCP 향상을 위해 최상단에 위치한 이미지 압축 작업을 진행했다.
  - 압축률은 96% 로 진행하였다.

| view |   압축 전 이미지 크기 (KB)   |   압축 후 이미지 크기 (KB)   |
|----------|----------|-----------|
| Desktop | 626.68 KB | 37.61 KB |
| Tablet | 434.54 KB | 25.13 KB |
| Mobile | 216.98 KB | 16.82KB |



### 3-5. Script 지연 처리

- 쿠키 관련 스크립트의 경우 HTML 파싱을 중지할만큼 중요하지 않다고 판단했다. -> defer 속성 추가해 스크립트를 지연 처리했다.


<br />


## 4. 성능 개선 이후 측정 비교

### 🎯 Lighthouse 점수


| 측정 항목 | 개선 전 | 개선 후 |
|----------|------|------|
| Performance | 72% 🟠  | 99% 🟢 |
| Accessibility | 82%  🟠 | 91% 🟢 |
| Best Practices | 93% 🟢  | 75% 🟠 |
| SEO | 82% 🟠 | 91% 🟢 |

<br />

### 📊 Core Web Vitals (2024) 



<table>
  <colgroup>
    <col style="width: 20%;">
    <col style="width: 40%;">
    <col style="width: 40%;">
  </colgroup>
  <thead>
    <tr>
      <th>측정 항목</th>
      <th>개선 전</th>
      <th>개선 후</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
      <td align="center"><img src="https://velog.velcdn.com/images/jmlee9707/post/2a58ea5e-24e9-4e33-94aa-9e39c0c1e12e/image.png" width="70%"></td>
      <td align="center"><img src="https://velog.velcdn.com/images/jmlee9707/post/2640ab54-a314-4bae-a39f-492d6ae6b9bf/image.png" width="70%"></td>
    </tr>
    <tr>
      <td>LCP</td>
      <td align="center">13.60s 🔴</td>
      <td align="center">2.11s 🟢</td>
    </tr>
    <tr>
      <td>INP</td>
      <td align="center">N/A 🟢</td>
      <td align="center">N/A 🟢</td>
    </tr>
    <tr>
      <td>CLS</td>
      <td align="center">0.011 🟢</td>
      <td align="center">0.001 🟢</td>
    </tr>
  </tbody>
</table>


<br />
<br />

---


## 99. 프론트엔드 성능 측정 항목

- FCP (First Contentful Paint) : 페이지 로드가 시작된 시점부터 페이지 콘텐츠의 일부가 화면에 렌더링되는 시점까지의 시간
- LCP(Largest Contentful Paint) : 페이지 로드가 시작된 시점부터 가장 큰 콘텐츠가 렌더링 되는 시간
- TBT (Total Blocking Time) : 총 차단 시간으로 FCP 이후 입력 응답성을 방지하기에 충분한 시간동안 기본 스레드가 차단되었던 총 시간
- CLS (Cumulative Layout Shift) : 페이지가 로드되는 동안 발생하는 예상치 못한 레이아웃 변경의 빈도 측정
- INP (Interaction to Next Paint) : 다음 페인트와의 상호작용으로, INP는 페이지가 사용자 입력에 얼마나 빠르게 반응하는지 측정

