## 주요 링크

  - S3 버킷 웹사이트 엔드포인트: http://front-4th-chapter4-2-basic.s3-website-ap-southeast-2.amazonaws.com/
  - CloudFront 배포 도메인 이름: d2ik0a44093kkh.cloudfront.net

## 성능 개선 보고서

1. 개선 이유

2. 개선 방법
  jpg 이미지 용량 최적화를 위한 확장자 변경
  웹에 적용된 사이즈만큼 이미지 크기 최적화
  웹폰트 css에서 직접 불러오도록 수정
  이미지 alt 태그 작성

3. 개선 후 향상된 지표
  기존 이미지 총 용량 2.38mb -> 782kb 67.14% 감소
  
  성능 점수 기존 67점 -> 78점
    LCP 3.3초 -> 1.1초 
    CLS 0.516 -> 0.425

  접근성 기존 82점 -> 91점

  검색엔진 최적화 기존 82점 -> 91점

4. 기타