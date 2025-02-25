// js/products.js - 이벤트 위임 적용
export async function loadProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();
        displayProducts(products);
        return products; // 호출자가 데이터에 접근할 수 있도록 반환
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
}

// 제품 요소 생성 함수로 분리
function createProductElement(product) {
    // 메인 제품 div 생성
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.dataset.productId = product.id; // 제품 ID를 데이터 속성으로 추가
    
    // 제품 이미지 div 생성
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('product-picture');
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = `product: ${product.title}`;
    img.width = 250;
    img.loading = "lazy"; // 이미지에 lazy loading 적용
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
    button.dataset.action = 'add-to-bag'; // 버튼 액션을 데이터 속성으로 추가
    
    // 요소들을 제품 정보 div에 추가
    infoDiv.appendChild(category);
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(button);
    
    // 이미지와 정보 div를 메인 제품 요소에 추가
    productElement.appendChild(pictureDiv);
    productElement.appendChild(infoDiv);
    
    return productElement;
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
    
    // 필요할 때만 워커 시작
    setTimeout(() => {
        worker.postMessage('start');
    }, 5000); // 5초 후 비필수 계산 시작
}

// 페이지 로드 후 제품 로드 시작
if (document.readyState === 'complete') {
    loadProducts();
    initializeHeavyCalculation();
} else {
    loadProducts();
    // 무거운 계산은 페이지 로드 완료 후에 초기화
    window.addEventListener('load', initializeHeavyCalculation);
}

// 모듈에서 주요 함수 내보내기
export default {
    loadProducts
};