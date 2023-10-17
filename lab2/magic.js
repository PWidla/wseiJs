const buttons = document.querySelectorAll('.slideNav');
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const pauseBtn = document.querySelector('#pause')
const playBtn = document.querySelector('#play')
const sliderWrapper = document.querySelector('#slider-wrapper');
let currentSlide = 1;
let slideWidth = 600;
let translateXValue = 0;
let isPaused = false;
let interval;

function startSlider(){
    interval = setInterval(() =>
    {
        if(!isPaused){
            nextBtn.click();
        }
    }, 1500);
}

startSlider();

function doTheMagic(slideValue) {
    const targetTranslateX = -slideWidth * (slideValue - 1);
    sliderWrapper.style.transform = `translateX(${targetTranslateX}px)`;
    translateXValue = targetTranslateX;
    console.log(translateXValue);
    currentSlide = slideValue;
}

function handleButtonClick(event) {
    if(event.target.id==="play"){
        isPaused = false;
    }
    else if(event.target.id==="pause"){
        isPaused = true;
    }
    else if (event.target.id === "prev" && currentSlide > 1) {
        if(!isPaused){
            clearInterval(interval);
        }
        doTheMagic(currentSlide - 1);
        if(!isPaused){
            startSlider();
        }

    } else if (event.target.id.startsWith("slide")) {
        const valueOfThisSlide = parseInt(event.target.id.replace("slide", ""), 10);
        doTheMagic(valueOfThisSlide);
        
    } else if (event.target.id === "next" && currentSlide < 5) {
        if(!isPaused){
            clearInterval(interval);
        }
        doTheMagic(currentSlide + 1);
        if(!isPaused){
            startSlider();
        }
    } else if (event.target.id === "next" && currentSlide === 5) {
        doTheMagic(1);
    }
}

buttons.forEach((button) => {
    button.onclick = handleButtonClick;
});
