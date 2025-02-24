function loadHighResImage(img) {
  const highResSource = img.dataset.src;
  if (highResSource) {
      img.src = highResSource;
      img.removeAttribute('data-src');
  }
}

const images = document.querySelectorAll('.progressive-image');
images.forEach(img => {
  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              loadHighResImage(entry.target);
              observer.unobserve(entry.target);
          }
      });
  });
  observer.observe(img);
});