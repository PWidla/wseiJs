const slider = document.getElementById("slider");
const slides = slider.children;
const numSlides = slides.length;
let currentSlide = 0;

function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 300}px)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % numSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + numSlides) % numSlides;
    updateSlider();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

const dots = document.getElementById("dots-container").children;
for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function () {
        goToSlide(i);
    });
}

function autoSlide() {
    nextSlide();
}

setInterval(autoSlide, 2500); 