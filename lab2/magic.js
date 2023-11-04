const buttons = document.querySelectorAll('.slideNav');
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const pauseSlideBtn = document.querySelector('#pauseSlide')
const playSlideBtn = document.querySelector('#playSlide')
const pauseFadeBtn = document.querySelector('#pauseFade')
const playFadeBtn = document.querySelector('#playFade')
const sliderWrapper = document.querySelector('#slider-wrapper');
const slidesContainer = document.querySelector('#slides');
const slides = slidesContainer.children;
const playBackwardsCheck = document.querySelector('#playBackwards')

let mode = "slider";
let currentSlide = 1;
let slideWidth = 600;
let translateXValue = 0;
let isPaused = false;
let interval;

function startSlider(){
    interval = setInterval(() =>
    {
        if(playBackwardsCheck.checked===true && !isPaused)
        {
            prevBtn.click();
        }
        else if(playBackwardsCheck.checked===false && !isPaused){
            nextBtn.click();
        }
    }, 1500);
}

startSlider();

function doTheSlide(slideValue) {
    const targetTranslateX = -slideWidth * (slideValue - 1);
    if(mode==="slider")
    {
        sliderWrapper.style.transform = `translateX(${targetTranslateX}px)`;
    }
    else if(mode==="fader")
    {
        let currentSlideElement = document.querySelector(`#slide${currentSlide}`);
        let nextSlideElement = document.querySelector(`#slide${slideValue}`);

        sliderWrapper.style.transform = `translateX(${targetTranslateX}px)`;
        currentSlideElement.classList.remove('unfade');
        nextSlideElement.classList.add('unfade');
    }
    translateXValue = targetTranslateX;
    currentSlide = slideValue;
}

function handleButtonClick(event) {
    if(event.target.id==="playSlide"){
        sliderWrapper.classList.remove('fadeSource');
        sliderWrapper.style.transform = `none`;
        sliderWrapper.style.transition = "transform 0.4s ease-in-out"; 
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('fade-base');
        }
        isPaused = false;
        mode="slider";
    }
    else if(event.target.id==="pauseSlide"){
        isPaused = true;
    }
    else if (event.target.id === "playFade") {
        isPaused = false;
        mode = "fader";
        sliderWrapper.classList.add('fadeSource');
        sliderWrapper.style.transition = "none"; 
        sliderWrapper.style.transform = `translateX(0)`;
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.add('fade-base');
        }
    }
    
    else if(event.target.id==="pauseFade"){
        isPaused = true;
    }

    else if (event.target.id === "prev" && currentSlide > 1) {
        if(!isPaused){
            clearInterval(interval);
        }
        doTheSlide(currentSlide - 1);
        if(!isPaused){
            startSlider();
        }

    } else if (event.target.id.startsWith("slide")) {
        const valueOfThisSlide = parseInt(event.target.id.replace("slide", ""), 10);
        doTheSlide(valueOfThisSlide);
        
    } else if (event.target.id === "next" && currentSlide < 5) {
        if(!isPaused){
            clearInterval(interval);
        }
        doTheSlide(currentSlide + 1);
        if(!isPaused){
            startSlider();
        }
    } else if (event.target.id === "next" && currentSlide === 5) {
        doTheSlide(1);
    } else if (event.target.id === "prev" && currentSlide === 1) {
        doTheSlide(5);
    }
}

buttons.forEach((button) => {
    button.onclick = handleButtonClick;
});
