async function loadProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    displayProducts(products);  
}

function displayProducts(products) {

    // Find the container where products will be displayed
    const container = document.querySelector('#all-products .container');

   
    // Iterate over each product and create the HTML structure safely
    products.forEach(product => {
        // Create the main product div
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        // Create the product picture div
        const pictureDiv = document.createElement('div');
        pictureDiv.classList.add('product-picture');
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = `product: ${product.title}`;
        img.width=250;
        pictureDiv.appendChild(img);

        // Create the product info div
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('product-info');

        const price = document.createElement('h3');
        price.classList.add('price');
        const priceSpan = document.createElement('span');
        priceSpan.textContent = `US$ ${product.price}`;
        price.appendChild(priceSpan);

        const title = document.createElement('h4');
        title.classList.add('title');
        title.textContent = product.title;

        const category = document.createElement('h5');
        category.classList.add('categories');
        category.textContent = product.category;

        const button = document.createElement('button');
        button.textContent = 'Add to bag';

        // Append elements to the product info div
        infoDiv.appendChild(price);
        infoDiv.appendChild(title);
        infoDiv.appendChild(category);
        infoDiv.appendChild(button);

        // Append picture and info divs to the main product element
        productElement.appendChild(pictureDiv);
        productElement.appendChild(infoDiv);

        // Append the new product element to the container
        container.appendChild(productElement);
    });

    

}



/**
 * 지연 로딩
 * 제품 섹션에 접근할 때만 무거운 작업 수행
 */
window.onload = () => {
    let status = 'idle';

    let productSection = document.querySelector('#all-products');


    window.onscroll = () => {
        let position = productSection.getBoundingClientRect().top - (window.scrollY + window.innerHeight);

        if (status === 'idle' && position <= 0) {
            status = 'loading';

            loadProducts();

            setTimeout(() => {
                // 무거운 작업을 청크(chunk)로 나누어 처리
                processHeavyCalculationInChunks(10000000, () => {
                    status = 'complete';
                    console.log('Heavy calculation completed');
                });
            }, 0);
        }
    }
}

function processHeavyCalculationInChunks(totalIterations, callback, chunkSize = 10000, index = 0) {
    // 현재 청크에서 처리할 반복 횟수 계산
    const currentChunkSize = Math.min(chunkSize, totalIterations - index);

    // 청크 처리
    if (currentChunkSize > 0) {
        // 현재 청크 실행
        setTimeout(() => {
            for (let i = 0; i < currentChunkSize; i++) {
                const currentIndex = index + i;
                const temp = Math.sqrt(currentIndex) * Math.sqrt(currentIndex);
            }

            // 다음 청크 처리를 위한 재귀 호출
            processHeavyCalculationInChunks(totalIterations, callback, chunkSize, index + currentChunkSize);
        }, 0);
    } else {
        // 모든 청크 처리 완료
        callback();
    }
}

