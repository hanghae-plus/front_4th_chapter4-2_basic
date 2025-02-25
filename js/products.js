// js/products.js - 인터섹션 옵저버를 활용한 스크롤 성능 최적화
export async function loadProducts() {
    try {
        // API 요청을 최적화하기 위한 캐싱 고려
        const cacheKey = 'product_data_cache';
        const cachedData = sessionStorage.getItem(cacheKey);
        
        // 캐시된 데이터가 있으면 사용
        if (cachedData) {
            console.log('캐시된 제품 데이터 사용');
            const products = JSON.parse(cachedData);
            
            // 제품을 청크(chunk)로 나누어 렌더링하기 위한 준비
            setupLazyProductRendering(products);
            return products;
        }
        
        // 캐시된 데이터가 없으면 API 요청
        console.log('API에서 제품 데이터 가져오기');
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        
        // 데이터 캐싱 (세션 스토리지에 저장)
        sessionStorage.setItem(cacheKey, JSON.stringify(products));
        
        // 제품을 청크(chunk)로 나누어 렌더링하기 위한 준비
        setupLazyProductRendering(products);
        return products;
    } catch (error) {
        console.error("제품 데이터 로딩 중 오류 발생:", error);
        return [];
    }
}

// 제품을 청크로 나누어 인터섹션 옵저버로 지연 렌더링하는 함수
function setupLazyProductRendering(products) {
    // 컨테이너 찾기
    const container = document.querySelector('#all-products .container');
    if (!container) return;
    
    // 제품을 청크로 나누기 (한 번에 6개씩 렌더링)
    const chunkSize = 6;
    const productChunks = [];
    
    for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
    }
    
    // 첫 번째 청크는 즉시 렌더링
    if (productChunks.length > 0) {
        renderProductChunk(container, productChunks[0]);
    }
    
    // 나머지 청크는 자리 표시자(placeholder) 생성
    for (let i = 1; i < productChunks.length; i++) {
        const placeholderId = `product-chunk-${i}`;
        const placeholder = document.createElement('div');
        placeholder.id = placeholderId;
        placeholder.className = 'product-chunk-placeholder';
        placeholder.style.minHeight = '300px';
        placeholder.dataset.chunkIndex = i;
        container.appendChild(placeholder);
    }
    
    // 인터섹션 옵저버 설정
    setupProductChunkObserver();
    
    // 이벤트 위임: 컨테이너에 하나의 이벤트 리스너만 추가
    setupContainerEventDelegation(container);
}

// 제품 청크 관찰을 위한 인터섹션 옵저버 설정
function setupProductChunkObserver() {
    const options = {
        rootMargin: '200px 0px', // 뷰포트 200px 전에 미리 로드 시작
        threshold: 0.1          // 10% 정도 보이면 로드 시작
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const chunkIndex = parseInt(placeholder.dataset.chunkIndex, 10);
                
                // 청크 인덱스로 제품 데이터 가져오기
                const cacheKey = 'product_data_cache';
                const cachedData = sessionStorage.getItem(cacheKey);
                
                if (cachedData) {
                    const allProducts = JSON.parse(cachedData);
                    const chunkSize = 6;
                    const startIndex = chunkIndex * chunkSize;
                    const chunkProducts = allProducts.slice(startIndex, startIndex + chunkSize);
                    
                    // 제품 청크 렌더링
                    const container = document.querySelector('#all-products .container');
                    renderProductChunk(container, chunkProducts, placeholder);
                    
                    // 플레이스홀더 제거
                    observer.unobserve(placeholder);
                }
            }
        });
    }, options);
    
    // 모든 플레이스홀더 관찰
    document.querySelectorAll('.product-chunk-placeholder').forEach(placeholder => {
        observer.observe(placeholder);
    });
}

// 제품 청크 렌더링 함수
function renderProductChunk(container, products, placeholder = null) {
    // 제품 요소 생성을 위한 DocumentFragment 사용
    const fragment = document.createDocumentFragment();
    
    // 각 제품에 대해 HTML 구조 생성
    products.forEach(product => {
        const productElement = createProductElement(product);
        fragment.appendChild(productElement);
    });
    
    // DOM에 추가
    if (placeholder) {
        // 플레이스홀더가 있으면 그 위치에 삽입
        container.insertBefore(fragment, placeholder);
        container.removeChild(placeholder);
    } else {
        // 없으면 컨테이너 끝에 추가
        container.appendChild(fragment);
    }
    
    // 새로 추가된 이미지에 프로그레시브 로딩 적용
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
    img.className = 'progressive-image blur';
    img.loading = 'lazy'; // 네이티브 lazy loading 속성 추가
    
    // 이미지 스타일 설정
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    
    // 저해상도 이미지로 시작 (LQIP 기법)
    const lowResUrl = createLowResImageFromUrl(product.image);
    img.src = lowResUrl;
    
    // 고해상도 이미지는 data 속성에 저장 (지연 로딩용)
    img.dataset.src = product.image;
    
    // 요소들을 추가
    pictureDiv.appendChild(img);
    
    // 제품 정보 div 생성
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

// 저해상도 이미지 URL 생성 (현실적인 구현)
function createLowResImageFromUrl(url) {
    // 개발 목적으로는 원본 URL 반환
    // 실제 환경에서는 이미지 프록시 서비스 사용 권장
    console.log('낮은 해상도로 먼저 로드할 이미지:', url);
    return url;
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
                        img.classList.remove('blur');
                        img.classList.add('loaded');
                        
                        // 관찰 중단
                        observer.unobserve(img);
                    };
                    
                    highResImage.onerror = () => {
                        // 이미지 로드 실패 시 대체 이미지 표시
                        img.src = 'images/placeholder.jpg';
                        img.classList.remove('blur');
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
}

// 무거운 계산 작업을 웹 워커로 이동 (필요한 경우)
function initializeHeavyCalculation() {
    if ('Worker' in window) {
        // 웹 워커 파일 분리 (worker.js로)
        const worker = new Worker('./js/worker.js');
        
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
}

// 페이지 로드 후 제품 로드 시작
if (document.readyState === 'complete') {
    loadProducts();
} else {
    // IntersectionObserver를 사용하여 뷰포트에 진입할 때만 제품 로드
    document.addEventListener('DOMContentLoaded', () => {
        const productSection = document.getElementById('all-products');
        
        if (productSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadProducts();
                    observer.disconnect();
                }
            }, {
                rootMargin: '200px 0px', // 뷰포트 200px 전에 미리 로드 시작
                threshold: 0.1
            });
            
            observer.observe(productSection);
        }
        
        // 무거운 계산은 페이지 로드 완료 후에 초기화 (필요한 경우)
        window.addEventListener('load', () => {
            // requestIdleCallback 사용하여 브라우저 유휴 시간에 실행
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    if (productSection && 'Worker' in window) {
                        initializeHeavyCalculation();
                    }
                }, { timeout: 5000 });
            } else {
                setTimeout(() => {
                    if (productSection && 'Worker' in window) {
                        initializeHeavyCalculation();
                    }
                }, 5000);
            }
        });
    });
}

// 모듈에서 주요 함수 내보내기
export default {
    loadProducts
};