function showTopBar() {
  let country = "France";
  let vat = 20;
  setTimeout(() => {
    document.querySelector(
      "section.country-bar"
    ).innerHTML = `<p>Orders to <b>${country}</b> are subject to <b>${vat}%</b> VAT</p>`;
    document.querySelector("section.country-bar");
  }, 1000);
}

function loadHighResImage(img) {
  const highResSource = img.dataset.src;
  if (highResSource) {
    img.src = highResSource;
    img.classList.add("loaded");
    img.removeAttribute("data-src");
  }
}

function preloadLowQualityImage() {
  const images = document.querySelectorAll("img.progressive-image");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadHighResImage(entry.target);
        obs.unobserve(entry.target);
      }
    });
  });

  images.forEach((img) => observer.observe(img));
}

document.addEventListener("DOMContentLoaded", () => {
  preloadLowQualityImage();
  showTopBar();
});
