# 바닐라 JS 프로젝트 성능 개선

- url: https://d3evlhnos2z3s3.cloudfront.net

## 성능 개선 보고서

### 1. 준비

- PageSpeed Insights를 사용해 측정
- desktop 환경으로 가정
- 파일 변경 후 콘솔에서 캐시 무효화 실행 확인

### 2. 개선 과정

1. 프로그레시브 이미지 로딩 기법 적용

   - https://pagespeed.web.dev/analysis/https-d3evlhnos2z3s3-cloudfront-net/t5sykptbyp?form_factor=desktop
   - 이유 :
     - 성능 저하 원인 중 이미지에 관련된 내용이 제일 많아, 이 부분을 우선 수정하기로 함.
     - 특히 배너 이미지가 2,470ms로 가장 큰 저하 요소이기 때문에 우선적으로 적용
   - 개선 방법 :
     - 프로그레시브 기법을 적용할 이미지에 progressive-image 클래스명을 추가하고, 해당 클래스명을 가진 요소는 기법을 적용하도록 수정
   - 개선 후 향상 지표
     - 성능 : 62 → 82 (30% 향상)

2. jpg to webp (성능 82→93)

   - https://pagespeed.web.dev/analysis/https-d3evlhnos2z3s3-cloudfront-net/p5asdgd0rl?form_factor=desktop
   - 이유 :
     - WebP 및 AVIF와 같은 이미지 형식은 PNG나 JPEG보다 압축률이 높기 때문에 다운로드가 빠르고 데이터 소비량도 적음
     - 2,156KB의 절감을 예상
   - 개선 방법 :
     - 이미지의 webp 변환 방법들 중, 한번에 변경 가능한 CLI방식을 선택
     - cwebp으로 images폴더 내의 jpg를 일괄 변경 `for %i in (*.jpg) do cwebp -q 80 "%i" -o "%~ni.webp"`
     - index.html에서 ".jpg" -> ".webp"로 일괄 변경
   - 개선 후 지표
     - 성능 : 82 -> 93
     - TBT : 100 -> 150 (성능 저하됨)
     - LCP : 2.6 -> 1.3
   - 기타
     - 전체적인 성능은 많이 향상되었지만 TBT가 오렌지 레벨 직전 수치를 보여 우려됨

3. lazy loading (성능 93->94)

   - https://pagespeed.web.dev/analysis/https-d3evlhnos2z3s3-cloudfront-net/n7b8o0mo97?form_factor=desktop
   - 이유 :
     - First Paint & LCP 최적화
   - 개선 방법 :
     - 외부 API로 불러오는 이미지에 lazy 클래스명을 추가하고, js로 적용했다.
   - 개선 후 지표
     - 성능 : 93 -> 94
     - TBT : 150 -> 160 (성능 저하됨)
     - LCP : 1.3 -> 1.2
   - 기타
     - TBT가 오렌지 레벨로 넘어가는 모습을 보였다.
     - 모바일 환경에서 데이터 사용량 절약 효과가 높은 개선안인데 데스크탑 기준으로 측정해서 유의미한 차이가 느껴지지 않는 걸 수도 있다는 생각을 했다.

4. 불필요한 dom제거

   - https://pagespeed.web.dev/analysis/https-d3evlhnos2z3s3-cloudfront-net/71gbutstew?form_factor=desktop
   - 이유 :
     - TBT 점수 향상
   - 개선 방법 :
     - 불필요하게 사용된 span을 제거하라는 권고를 따름
   - 개선 후 향상 지표
     - 성능 : 94 -> 97
     - TBT : 160-> 110

# 질문

1. 매 수정 이후마다 캐시 무효화를 실행했는데 의미가 있는 것인지 궁금합니다.
