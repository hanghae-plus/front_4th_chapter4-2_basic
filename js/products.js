async function loadProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();
  displayProducts(products);
}

function displayProducts(products) {
  // Find the container where products will be displayed
  const container = document.querySelector("#all-products .container");

  // Iterate over each product and create the HTML structure safely
  products.forEach((product) => {
    // Create the main product div
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    // Create the product picture div
    const pictureDiv = document.createElement("div");
    pictureDiv.classList.add("product-picture");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = `product: ${product.title}`;
    img.loading = "lazy";
    img.width = 250;
    pictureDiv.appendChild(img);

    // Create the product info div
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("product-info");

    const category = document.createElement("h1");
    category.classList.add("categories");
    category.textContent = product.category;

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = product.title;

    const price = document.createElement("h3");
    price.classList.add("price");
    const priceSpan = document.createElement("span");
    priceSpan.textContent = `US$ ${product.price}`;
    price.appendChild(priceSpan);

    const button = document.createElement("button");
    button.textContent = "Add to bag";

    // Append elements to the product info div
    infoDiv.appendChild(category);
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(button);

    // Append picture and info divs to the main product element
    productElement.appendChild(pictureDiv);
    productElement.appendChild(infoDiv);

    // Append the new product element to the container
    container.appendChild(productElement);
  });
}

loadProducts();

function performHeavyCalculation() {
  const totalIterations = 10000000;
  const chunkSize = 100000; // 한 번에 처리할 반복 횟수
  let currentIteration = 0;

  function processChunk() {
    // 현재 청크에서 처리할 반복 횟수 계산
    const limit = Math.min(currentIteration + chunkSize, totalIterations);

    // 청크 처리
    for (let i = currentIteration; i < limit; i++) {
      const temp = Math.sqrt(i) * Math.sqrt(i);
    }

    // 진행 상황 업데이트
    currentIteration = limit;

    // 모든 반복이 완료되었는지 확인
    if (currentIteration < totalIterations) {
      // 다음 청크를 처리하기 위해 setTimeout 사용
      setTimeout(processChunk, 0);
    } else {
      console.log("무거운 계산 작업 완료");
    }
  }

  // 첫 번째 청크 처리 시작
  setTimeout(processChunk, 0);
}

// 무거운 계산 작업 시작
performHeavyCalculation();
