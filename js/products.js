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
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            
            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            
            const products = await response.json();
            
            // 데이터 캐싱 (세션 스토리지에 저장)
            sessionStorage.setItem(cacheKey, JSON.stringify(products));
            
            displayProducts(products);
            return products;
        } catch (fetchError) {
            throw fetchError;
        }
    } catch (error) {
        console.error("제품 데이터 로딩 중 오류 발생:", error);
        displayErrorState();
        return [];
    }
}

// 오류 상태 표시
function displayErrorState() {
    const container = document.querySelector('#all-products .container');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align:center;padding:30px;">
            <h3>Unable to load products</h3>
            <p>Please try again later</p>
            <button onclick="window.location.reload()">Retry</button>
        </div>
    `;
}

function displayProducts(products) {
    // 컨테이너 찾기
    const container = document.querySelector('#all-products .container');
    if (!container) return;
    
    // 로딩 상태의 기존 높이 측정
    const oldHeight = container.offsetHeight;
    
    // 새 콘텐츠 생성을 위한 DocumentFragment 사용
    const fragment = document.createDocumentFragment();
    
    // 각 제품에 대해 HTML 구조 생성
    products.forEach(product => {
        const productElement = createProductElement(product);
        fragment.appendChild(productElement);
    });
    
    // 임시 래퍼에 콘텐츠 추가하여 새 높이 측정
    const tempWrapper = document.createElement('div');
    tempWrapper.style.visibility = 'hidden';
    tempWrapper.style.position = 'absolute';
    tempWrapper.style.width = container.offsetWidth + 'px';
    tempWrapper.appendChild(fragment.cloneNode(true));
    document.body.appendChild(tempWrapper);
    
    // 높이 설정으로 레이아웃 시프트 방지
    container.style.minHeight = oldHeight + 'px';
    
    // 콘텐츠 교체
    container.innerHTML = '';
    container.appendChild(fragment);
    
    // 임시 래퍼 제거
    document.body.removeChild(tempWrapper);
    
    // 이벤트 위임 설정
    setupContainerEventDelegation(container);
    
    // 이미지 로딩 설정
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

// 모듈에서 주요 함수 내보내기
export default {
    loadProducts
};