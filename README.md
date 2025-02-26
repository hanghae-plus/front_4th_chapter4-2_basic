# 바닐라 JS 프로젝트 성능개선

- url: https://d3ksk4tg75lhhm.cloudfront.net

## 성능 개선 보고서

### 기존 성능 측정 결과

맨 처음 프로젝트를 배포만 했을 때의 성능 측정 결과는 다음과 같습니다.

#### 🎯 Lighthouse 점수
| 카테고리 | 점수 | 상태 |
|----------|------|------|
| Performance | 72% | 🟠 |
| Accessibility | 82% | 🟠 |
| Best Practices | 75% | 🟠 |
| SEO | 82% | 🟠 |
| PWA | 0% | 🔴 |

#### 📊 Core Web Vitals
| 메트릭 | 설명 | 측정값 | 상태 |
|--------|------|--------|------|
| LCP | Largest Contentful Paint | 14.71s | 🔴 |
| INP | Interaction to Next Paint | N/A | 🟢 |
| CLS | Cumulative Layout Shift | 0.011 | 🟢 |

### 성능 개선 작업

#### 1. 이미지 최적화
- 기존 .jpg 파일로 되어있던 이미지를 .webp 파일로 변경하여 이미지 최적화를 진행했습니다.
- `<picture>` 태그를 사용하여 브라우저가 지원하는 이미지 형식을 선택할 수 있도록 했습니다.
- 이미지의 width와 height를 속성을 명시했습니다.
- lazy 속성을 사용하여 이미지를 지연로딩하도록 했습니다.

#### 2. 리소스 최적화


- script 태그에 `defer` `async` 속성을 추가하여 리소스를 비동기로 로드하도록 했습니다.
   - 페이지 렌더링에 필요한 핵심 script와 Cookie Consent는 `defer` 속성을 사용했습니다.
   - Google Tag Manager는 `async` 속성을 사용했습니다.
 
> - `defer` 속성:
    - HTML 파싱이 완료된 후 스크립트가 실행
    - 문서 순서대로 실행되므로 의존성이 있는 스크립트에 적합
    - main.js와 products.js와 같은 핵심 기능 스크립트에 사용
> - `async` 속성:
    - HTML 파싱과 병렬로 다운로드되고 즉시 실행
    - 페이지 로딩을 차단하지 않음
    - Google Tag Manager같은 독립적인 써드파티 스크립트에 적합

#### 3. SEO 최적화

- meta 태그를 추가하여 검색엔진 최적화를 진행했습니다.
- og 태그를 추가하여 SNS 공유 시 미리보기 이미지와 설명을 추가했습니다.
- 이미지에 alt 속성을 추가하여 이미지에 대한 설명을 추가했습니다.
- ARIA 속성을 추가하여 웹 접근성을 개선했습니다.

#### 4. 폰트 최적화

- 기존의 웹폰트를 사용하는 방식에서 로컬에 필요한 폰트만을 다운로드하여 사용하도록 변경했습니다.


### 결과

#### 🎯 Lighthouse 점수
| 카테고리 | 점수 | 상태 | 변화           |
|----------|------|------|--------------|
| Performance | 94% | 🟢 | 27.78% 성능 향상 |
| Accessibility | 95% | 🟢 | 15.85% 성능 향상 |
| Best Practices | 75% | 🟠 | 0%           |
| SEO | 100% | 🟢 | 21.95% 성능 향상 |
| PWA | 0% | 🔴 | 0%           |

#### 📊 Core Web Vitals
| 메트릭 | 설명 | 측정값 | 상태 | 변화 |
|--------|------|--------|------|------|
| LCP | Largest Contentful Paint | 2.59s | 🟠 | 82.39% 성능이 향상|
| INP | Interaction to Next Paint | N/A | 🟢 | 0% |
| CLS | Cumulative Layout Shift | 0.009 | 🟢 | 18.18% 성능이 향상|

#### Page Speed Insights 점수

##### 휴대전화

![](https://i.imgur.com/XzAEOKG.png)

##### 데스크탑

![](https://i.imgur.com/u7Ca6vR.png)
