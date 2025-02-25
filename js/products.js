// js/products.js - 이미지 최적화 및 성능 개선 적용
export async function loadProducts() {
    try {
        // API 요청을 최적화하기 위한 캐싱 고려
        const cacheKey = 'product_data_cache';
        const cachedData = sessionStorage.getItem(cacheKey);
        
        // 캐시된 데이터가 있으면 사용
        if (cachedData) {
            console.log('캐시된 제품 데이터 사용');
            const products = JSON.parse(cachedData);
            displayProducts(products);
            return products;
        }
        
        // 캐시된 데이터가 없으면 API 요청
        console.log('API에서 제품 데이터 가져오기');
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        
        // 데이터 캐싱 (세션 스토리지에 저장)
        sessionStorage.setItem(cacheKey, JSON.stringify(products));
        
        displayProducts(products);
        return products;
    } catch (error) {
        console.error("제품 데이터 로딩 중 오류 발생:", error);
        return [];
    }
}

function displayProducts(products) {
    // 컨테이너 찾기
    const container = document.querySelector('#all-products .container');
    if (!container) return;
    
    // 제품 요소 생성을 위한 DocumentFragment 사용
    const fragment = document.createDocumentFragment();
    
    // 각 제품에 대해 HTML 구조 생성
    products.forEach(product => {
        // 이미지 lazy loading 적용
        const productElement = createProductElement(product);
        fragment.appendChild(productElement);
    });
    
    // 한 번에 DOM에 추가
    container.appendChild(fragment);
    
    // 이벤트 위임: 컨테이너에 하나의 이벤트 리스너만 추가
    setupContainerEventDelegation(container);
    
    // 프로그레시브 이미지 로딩 적용
    setupProgressiveImageLoading();
}

// 이미지 로딩 문제 해결을 위한 개선된 함수
function createProductElement(product) {
    // 메인 제품 div 생성
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.dataset.productId = product.id;
    
    // 제품 이미지 div 생성
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('product-picture');
    
    // 이미지 컨테이너 스타일 설정 - 회색 배경 제거
    pictureDiv.style.backgroundColor = 'white';
    pictureDiv.style.display = 'flex';
    pictureDiv.style.justifyContent = 'center';
    pictureDiv.style.alignItems = 'center';
    pictureDiv.style.height = '220px';
    
    // 이미지 요소 생성
    const img = document.createElement('img');
    img.alt = `product: ${product.title}`;
    img.width = 250;
    img.height = 250;
    
    // 이미지 스타일 설정
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    img.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // 이미지 로드 전 처리
    img.style.opacity = '0';
    
    // 이미지 로드 이벤트
    img.onload = function() {
        img.style.opacity = '1';
    };
    
    img.onerror = function() {
        img.src = 'images/placeholder.jpg';
        img.style.opacity = '1';
    };
    
    // 이미지 URL 설정
    img.src = product.image;
    
    // 요소들을 추가
    pictureDiv.appendChild(img);
    
    // 제품 정보 div 생성 (기존 코드와 동일)
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('product-info');
    
    const category = document.createElement('h5');
    category.classList.add('categories');
    category.textContent = product.category;
    
    const title = document.createElement('h4');
    title.classList.add('title');
    title.textContent = product.title;
    
    const price = document.createElement('h3');
    price.classList.add('price');
    const priceSpan = document.createElement('span');
    priceSpan.textContent = `US$ ${product.price}`;
    price.appendChild(priceSpan);
    
    const button = document.createElement('button');
    button.textContent = 'Add to bag';
    button.dataset.action = 'add-to-bag';
    
    infoDiv.appendChild(category);
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(button);
    
    productElement.appendChild(pictureDiv);
    productElement.appendChild(infoDiv);
    
    return productElement;
}

// 이미지 URL 최적화 (현실적인 구현)
function convertUrlToWebP(url) {
    // 외부 API 이미지를 WebP로 변환하는 실제적인 방법:
    // 1. 이미지 프록시 서비스 사용 (예: Cloudinary, Imgix)
    // 아래는 Cloudinary를 사용하는 예시 (실제 계정 정보로 대체 필요)
    // return `https://res.cloudinary.com/your-account/image/fetch/f_webp,q_auto/${encodeURIComponent(url)}`;
    
    // 2. 자체 이미지 프록시 서버 사용 (백엔드 구현 필요)
    // return `https://your-api.com/image-proxy?url=${encodeURIComponent(url)}&format=webp`;
    
    // 3. 개발 목적으로는 원본 URL 반환 (실제 환경에서는 위 방법 중 하나 사용)
    console.log('WebP 변환이 필요한 이미지:', url);
    return url;
}

// 저해상도 이미지 URL 생성 (현실적인 구현)
function createLowResImageFromUrl(url) {
    // 실제 구현 방법:
    // 1. 이미지 프록시 서비스 사용
    // return `https://res.cloudinary.com/your-account/image/fetch/w_50,q_30/${encodeURIComponent(url)}`;
    
    // 2. 자체 이미지 프록시 서버 사용
    // return `https://your-api.com/image-proxy?url=${encodeURIComponent(url)}&width=50&quality=30`;
    
    // 3. Base64 블러 이미지를 생성하는 방법도 있으나 이는 클라이언트에서 원본 이미지 다운로드 필요
    // 개발 목적으로는 원본 이미지 반환 (실제 환경에서는 위 방법 중 하나 사용)
    return url;
}

// 제품 카테고리에 따라 대략적인 배경색 반환 (LQIP 대용)
function getDominantColorFromProduct(product) {
    // 실제로는 이미지 분석을 통해 주요 색상을 추출하거나
    // 제품 정보에서 색상 정보를 가져오는 것이 좋습니다
    // 여기서는 카테고리에 따라 간단히 색상을 할당합니다
    const category = product.category?.toLowerCase() || '';
    
    if (category.includes('electronics')) {
        return '#f0f0f0'; // 전자제품은 밝은 회색
    } else if (category.includes('jewelry') || category.includes('jewelery')) {
        return '#f8e8c8'; // 주얼리는 금색 계열
    } else if (category.includes('men')) {
        return '#d8e0e8'; // 남성 의류는 파란 계열
    } else if (category.includes('women')) {
        return '#f8e0e8'; // 여성 의류는 분홍 계열
    }
    
    // 기본 색상
    return '#f5f5f5';
}

// 프로그레시브 이미지 로딩 설정
function setupProgressiveImageLoading() {
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    // 고해상도 이미지 로드
                    const highResImage = new Image();
                    
                    highResImage.onload = () => {
                        img.src = src;
                        img.style.opacity = '1'; // 이미지가 로드되면 표시
                        
                        // 관찰 중단
                        observer.unobserve(img);
                    };
                    
                    highResImage.onerror = () => {
                        // 이미지 로드 실패 시 대체 이미지 표시
                        img.src = 'images/placeholder.jpg';
                        img.style.opacity = '1';
                        observer.unobserve(img);
                    };
                    
                    // 지연 시간 추가 (UX에 영향 없이 로딩 분산)
                    setTimeout(() => {
                        highResImage.src = src;
                    }, Math.random() * 300); // 0-300ms 사이 랜덤 지연
                }
            }
        });
    }, {
        rootMargin: '100px 0px', // 뷰포트 100px 전에 미리 로드 시작
        threshold: 0.1
    });
    
    // 동적으로 생성된 이미지들에 관찰자 적용
    const progressiveImages = document.querySelectorAll('.progressive-image');
    progressiveImages.forEach(img => {
        imgObserver.observe(img);
    });
}

// 이벤트 위임: 컨테이너에 하나의 이벤트 리스너 추가
function setupContainerEventDelegation(container) {
    container.addEventListener('click', (event) => {
        // 이벤트 위임: 클릭된 요소 또는 상위 요소가 특정 선택자와 일치하는지 확인
        const addToCartButton = event.target.closest('[data-action="add-to-bag"]');
        
        if (addToCartButton) {
            // 제품 요소 찾기 (버튼의 상위 요소)
            const productElement = addToCartButton.closest('.product');
            const productId = productElement?.dataset.productId;
            
            if (productId) {
                // 장바구니에 추가 로직 실행
                addToCart(productId);
            }
        }
    });
}

// 장바구니에 추가하는 함수
function addToCart(productId) {
    console.log(`제품 ID: ${productId}가 장바구니에 추가되었습니다.`);
    alert('Added to bag!');
    
    // 실제 장바구니 추가 로직은 여기에 구현
    // 예: 장바구니 데이터 업데이트, API 호출 등
}

// 무거운 계산 작업을 웹 워커로 이동
function initializeHeavyCalculation() {
    // 웹 워커 파일 분리 (worker.js로)
    const worker = new Worker('../worker.js');
    
    worker.onmessage = function(e) {
        console.log('Heavy calculation result:', e.data);
    };
    
    // 필요할 때만 워커 시작 - requestIdleCallback 사용
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            worker.postMessage('start');
        }, { timeout: 5000 });
    } else {
        // requestIdleCallback을 지원하지 않는 브라우저용 폴백
        setTimeout(() => {
            worker.postMessage('start');
        }, 5000);
    }
}

// 페이지 로드 후 제품 로드 시작
if (document.readyState === 'complete') {
    loadProducts();
    initializeHeavyCalculation();
} else {
    // IntersectionObserver를 사용하여 뷰포트에 진입할 때만 제품 로드
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadProducts();
            observer.disconnect();
        }
    });
    
    // 문서 로드 후 제품 섹션 관찰 시작
    document.addEventListener('DOMContentLoaded', () => {
        const productSection = document.getElementById('all-products');
        if (productSection) {
            observer.observe(productSection);
        } else {
            // 섹션을 찾을 수 없는 경우 즉시 로드
            loadProducts();
        }
        
        // 무거운 계산은 페이지 로드 완료 후에 초기화
        window.addEventListener('load', () => {
            // requestIdleCallback 사용하여 브라우저 유휴 시간에 실행
            if ('requestIdleCallback' in window) {
                requestIdleCallback(initializeHeavyCalculation, { timeout: 5000 });
            } else {
                setTimeout(initializeHeavyCalculation, 5000);
            }
        });
    });
}

// 모듈에서 주요 함수 내보내기
export default {
    loadProducts
};