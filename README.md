# 바닐라 JS 프로젝트 성능 개선
- url: https://dref3bg2xtuff.cloudfront.net

## 성능 개선 보고서
- 지난주에 AWS에 셋팅한 것을 이용하였고 GitHub Actions으로 배포 자동화를 해주었다.
- 처음 성능 지표 사진
  ![Image](https://github.com/user-attachments/assets/846f0a22-5c24-4421-81f0-4c8fef8e6a58)

1. jpg, png 등의 이미지를 webp로 변환
   - 개선 이유
     1) webp 변환을 통해 jpg나 png보다 더 작은 용량을 제공해서 로딩 속도를 줄일 수 있음
     2) 더 작은 용량을 제공하기 때문에 브라우저가 이미지를 더 빠르게 렌더링 가능
     3) 대부분의 최신 브라우저를 지원함

   - 개선 방법
     1) webp로 변환
         ![Image](https://github.com/user-attachments/assets/3ad997ab-4710-4619-a3c4-fad1534345e0)
     2) picture 태그로 감싸서 사용
        ```
          <picture>
              <source srcset="images/Hero_Desktop.webp" type="image/webp" />
              <img class="desktop" src="images/Hero_Desktop.png" alt="screen: Desktop Case" />
          </picture>
        ```

2. img 태그에 alt 속성 추가
   - 개선 이유
     1) alt 속성을 추가하면 검색 엔진이 이미지를 더 쉽게 이해하고, 검색 결과에서 이미지가 잘 노출되도록 함

   - 개선 방법
     1) img 태그에 적절한 alt 속성 작성

3. 쿠키 동의 스크립트 로딩 문제 수정
   - 개선 이유
     1) 쿠키 동의 스크립트에 undefined 문제가 발생하고 있었다. 
        스크립트 실행 시점 문제이고 브라우저가 스크립트 실행 순서를 보장하지 않았다.

   - 개선 방법
     1) 쿠키 동의 스크립트에 defer 속성 추가
     2) JS 코드 최적화 진행
        ```
          <script type="text/javascript" src="//www.freeprivacypolicy.com/public/cookie-consent/4.1.0/cookie-consent.js" charset="UTF-8" defer></script>
          <script type="text/javascript" charset="UTF-8" defer>
              document.addEventListener('DOMContentLoaded', function() {
                  if (typeof cookieconsent !== 'undefined') {
                      cookieconsent.run({"notice_banner_type":"simple","consent_type":"express","palette":"light","language":"en","page_load_consent_levels":["strictly-necessary"],"notice_banner_reject_button_hide":false,"preferences_center_close_button_hide":false,"page_refresh_confirmation_buttons":false,"website_name":"Performance Course"});
                  } else {
                      console.error('Cookie consent library not loaded properly');
                  }
              });
          </script>
        ```
4. 로컬 폰트 적용
   - 개선 이유
     1) 로컬 폰트 적용을 하면 외부 폰트를 로드할 때 발생하는 네트워크 요청을 제거하기 때문에 페이지 로딩 속도를 개선
     2) 폰트를 로컬에 저장하게 되면 브라우저 캐싱이 적용되서 더 빠르게 로드

   - 개선 방법
     1) 폰트 파일을 다운로드하여 fonts 디렉토리에 저장
     2) CSS에 @font-face 사용
        ```
          @font-face {
              font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
              font-family: 'Heebo';
              font-style: normal;
              font-weight: 300;
              src: url('../css/fonts/heebo-v26-latin-300.woff2') format('woff2'); /* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
          }
        ```
     3) font-display: swap; 넣음으로써, FOIT(텍스트가 보이지 않는 현상) 방지 가능

5. 불필요한 JS 부분 제거
   - product.js에 사용하지 않은 코드가 있는데 불필요해 보여 삭제
     ```
      for (let i = 0; i < 10000000; i++) {
          const temp = Math.sqrt(i) * Math.sqrt(i);
      }
     ```


## 성능 개선 결과
![Image](https://github.com/user-attachments/assets/4b2273e5-2a5b-4348-9475-e6929c5bc140)

