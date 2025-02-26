document.addEventListener("DOMContentLoaded", () => {
  // 베스트셀러 섹션의 모든 제품 가져오기
  const products = document.querySelectorAll(
    "section.best-sellers .product-slider .product"
  );

  products.forEach((product) => {
    // 이미지 스켈레톤 처리
    const img = product.querySelector(".product-picture img");
    const imgSkeleton = product.querySelector(".skeleton-image");

    // 초기에 이미지 숨기기
    img.style.display = "none";

    //  제품 정보 스켈레톤 만들기
    const productInfo = product.querySelector(".product-info");
    const originalContent = Array.from(productInfo.children);

    // 원래 콘텐츠 숨기기
    originalContent.forEach((el) => (el.style.display = "none"));

    // 간단한 스켈레톤 요소들 추가
    const infoSkeletons = [];

    // 카테고리 스켈레톤
    const catSkeleton = document.createElement("div");
    catSkeleton.classList.add("skeleton");
    catSkeleton.style.height = "16px";
    catSkeleton.style.width = "70%";
    catSkeleton.style.marginBottom = "10px";
    infoSkeletons.push(catSkeleton);

    // 타이틀 스켈레톤
    const titleSkeleton = document.createElement("div");
    titleSkeleton.classList.add("skeleton");
    titleSkeleton.style.height = "20px";
    titleSkeleton.style.width = "90%";
    titleSkeleton.style.marginBottom = "10px";
    infoSkeletons.push(titleSkeleton);

    // 가격 스켈레톤
    const priceSkeleton = document.createElement("div");
    priceSkeleton.classList.add("skeleton");
    priceSkeleton.style.height = "24px";
    priceSkeleton.style.width = "50%";
    priceSkeleton.style.marginBottom = "15px";
    infoSkeletons.push(priceSkeleton);

    // 버튼 스켈레톤
    const btnSkeleton = document.createElement("div");
    btnSkeleton.classList.add("skeleton");
    btnSkeleton.style.height = "36px";
    btnSkeleton.style.width = "100%";
    infoSkeletons.push(btnSkeleton);

    // 스켈레톤 요소들 추가
    infoSkeletons.forEach((skeleton) => productInfo.appendChild(skeleton));

    // 콘텐츠 표시 함수
    function showContent() {
      // 이미지 표시
      imgSkeleton.style.display = "none";
      img.style.display = "block";

      // 모든 스켈레톤 제거
      infoSkeletons.forEach((skeleton) => skeleton.remove());

      // 원래 콘텐츠 표시
      originalContent.forEach((el) => (el.style.display = ""));
    }

    // 4. 이미지 로드 이벤트 처리
    if (img.complete) {
      // 이미지가 이미 캐시되어 있는 경우
      showContent();
    } else {
      // 이미지 로드 완료 시 콘텐츠 표시
      img.addEventListener("load", showContent);

      // 3초 후에도 로드되지 않으면 콘텐츠 표시 (타임아웃 안전장치)
      setTimeout(showContent, 3000);
    }
  });
});
