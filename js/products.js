async function loadProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();
  displayProducts(products);
}

function displayProducts(products) {
  // Find the container where products will be displayed
  const container = document.querySelector("#all-products .container");

  // 성능 최적화를 위해 DocumentFragment 사용
  const fragment = document.createDocumentFragment();

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
    img.width = 250;
    img.height = 250;
    img.loading = "lazy";
    // webp 지원을 위한 srcset 적용
    img.srcset =
      product.image.replace(/\.(jpg|png)$/, ".webp") +
      " 1x, " +
      product.image +
      " 2x";

    if (product.id === 1) {
      img.fetchpriority = "high";
    }

    pictureDiv.appendChild(img);

    // Create the product info div
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("product-info");

    const category = document.createElement("h5");
    category.classList.add("categories");
    category.textContent = product.category;

    const title = document.createElement("h4");
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

    fragment.appendChild(productElement);
  });

  // Append the new product element to the container
  container.appendChild(fragment);
}

loadProducts();

// Simulate heavy operation. It could be a complex price calculation.
// 필요없는 로직같아서 주석 처리
// requestIdleCallback(() => {
//   for (let i = 0; i < 10000000; i++) {
//     const temp = Math.sqrt(i) * Math.sqrt(i);
//   }
// });
