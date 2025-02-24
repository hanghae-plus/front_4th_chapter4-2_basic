//로드하는 동안 표시할 skeleton 요소를 만듬
function createSkeletons() {
  const container = document.querySelector("#all-products .container");

  // skeleton 8개(임시값) 생성
  for (let i = 0; i < 8; i++) {
    const skeletonProduct = document.createElement("div");
    skeletonProduct.classList.add("product", "skeleton-product");

    // image 영역 skeleton
    const skeletonPicture = document.createElement("div");
    skeletonPicture.classList.add("product-picture", "skeleton");
    skeletonPicture.style.height = "160px";

    // info 영역 skeleton
    const skeletonInfo = document.createElement("div");
    skeletonInfo.classList.add("product-info");

    // content 영역 skeleton
    const skeletonCategory = document.createElement("div");
    skeletonCategory.classList.add("skeleton");
    skeletonCategory.style.height = "20px";
    skeletonCategory.style.width = "70%";
    skeletonCategory.style.marginBottom = "10px";

    const skeletonTitle = document.createElement("div");
    skeletonTitle.classList.add("skeleton");
    skeletonTitle.style.height = "24px";
    skeletonTitle.style.width = "90%";
    skeletonTitle.style.marginBottom = "10px";

    const skeletonPrice = document.createElement("div");
    skeletonPrice.classList.add("skeleton");
    skeletonPrice.style.height = "28px";
    skeletonPrice.style.width = "40%";
    skeletonPrice.style.marginBottom = "15px";

    const skeletonButton = document.createElement("div");
    skeletonButton.classList.add("skeleton");
    skeletonButton.style.height = "36px";
    skeletonButton.style.width = "100%";

    //  skeleton 추가
    skeletonInfo.appendChild(skeletonCategory);
    skeletonInfo.appendChild(skeletonTitle);
    skeletonInfo.appendChild(skeletonPrice);
    skeletonInfo.appendChild(skeletonButton);

    skeletonProduct.appendChild(skeletonPicture);
    skeletonProduct.appendChild(skeletonInfo);

    container.appendChild(skeletonProduct);
  }
}

// skeleton 제거
function removeSkeletons() {
  const skeletons = document.querySelectorAll(".skeleton-product");
  skeletons.forEach((skeleton) => skeleton.remove());
}

async function loadProducts() {
  try {
    createSkeletons();

    for (let i = 0; i < 10000000; i++) {
      const temp = Math.sqrt(i) * Math.sqrt(i);
    }

    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    removeSkeletons();
    displayProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
  }
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

    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = product.image;

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = `product: ${product.title}`;
    img.width = 250;
    img.loading = "lazy";

    picture.appendChild(source);
    picture.appendChild(img);

    pictureDiv.appendChild(picture);

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

    // Append the new product element to the container
    container.appendChild(productElement);
  });
}

loadProducts();
