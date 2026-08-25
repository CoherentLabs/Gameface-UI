class GallerySlider extends HTMLElement {
  constructor() {
    super(...arguments);
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.autoSlide = 0;
    this.interval = null;
  }
  connectedCallback() {
    this.currentSlide = 0;
    this.slidesList = this.querySelector(".slides-list");
    this.slides = this.querySelectorAll(".slide");
    this.totalSlides = this.slides.length;
    this.autoSlide = parseInt(this.dataset.autoSlide || "0", 10);
    this.interval = null;
    if (this.totalSlides === 0) return;
    this.querySelector(".left")?.addEventListener(
      "click",
      () => this.move("back")
    );
    this.querySelector(".right")?.addEventListener(
      "click",
      () => this.move("forward")
    );
    this.resetAutoSlide();
  }
  move(direction) {
    if (direction === "back") {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    } else {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }
    this.updateDOM();
    this.resetAutoSlide();
  }
  updateDOM() {
    if (this.slidesList)
      this.slidesList.style.transform = `translateX(-${this.currentSlide * 100}%)`;
  }
  resetAutoSlide() {
    if (this.autoSlide > 0) {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(
        () => this.move("forward"),
        this.autoSlide
      );
    }
  }
}
if (!customElements.get("gallery-slider")) {
  customElements.define("gallery-slider", GallerySlider);
}
