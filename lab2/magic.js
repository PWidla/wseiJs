const buttons = document.querySelectorAll('.slideNav');
const sliderWrapper = document.querySelector('#slider-wrapper');
let currentSlide = 1;
let slideWidth = 600;
let translateXValue = 0;

function doTheMagic(slideValue) {
    const targetTranslateX = -slideWidth * (slideValue - 1);
    sliderWrapper.style.transform = `translateX(${targetTranslateX}px)`;
    translateXValue = targetTranslateX;
    console.log(translateXValue);
    currentSlide = slideValue;
}

function handleButtonClick(event) {
    if (event.target.id === "prev" && currentSlide > 1) {
        doTheMagic(currentSlide - 1);
    } else if (event.target.id.startsWith("slide")) {
        const valueOfThisSlide = parseInt(event.target.id.replace("slide", ""), 10);
        doTheMagic(valueOfThisSlide);
    } else if (event.target.id === "next" && currentSlide < 5) {
        doTheMagic(currentSlide + 1);
    }
}

buttons.forEach((button) => {
    button.onclick = handleButtonClick;
});
