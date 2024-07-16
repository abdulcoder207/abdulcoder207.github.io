let currentSlide = 0;

function changeSlide(direction) {
    const slides = document.querySelector('.slides');
    const totalSlides = slides.children.length;

    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

    const slideWidth = slides.children[0].clientWidth;
    slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}
