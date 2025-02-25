// js/products.js - 모듈로 변환
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
}

// 제품 요소 생성 함수로 분리
function createProductElement(product) {
    // 메인 제품 div 생성
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    
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
    
    // 인터섹션 옵저버로 비동기 이벤트 핸들러 설정
    setupButtonInteraction(button);
    
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

// 버튼에 대한 인터랙션 설정 (성능 향상을 위한 지연 바인딩)
function setupButtonInteraction(button) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                button.addEventListener('click', () => {
                    alert('Added to bag!');
                });
                observer.disconnect(); // 한 번 추가한 후 관찰 중지
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(button);
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