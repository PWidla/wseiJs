// const btnPrzelicz = document.querySelector('#przelicz')
const btnDodajPole = document.querySelector('#dodajPole')
const btnUsunPole = document.querySelector('#usunPole')
const wynikiPojemnik = document.querySelector('#wyniki')
const polaPojemnik = document.querySelector('#polaTekstowe')
let liczbyInput = document.querySelectorAll('.liczba');

for (let i = 0; i < liczbyInput.length; i++) {
    liczbyInput[i].addEventListener('input', Oblicz);
}

btnDodajPole.addEventListener('click', () => {
    const nowePole = document.createElement("input");
    nowePole.type = 'text';
    nowePole.className = 'liczba';
    
    polaPojemnik.appendChild(nowePole);
    nowePole.addEventListener('input', Oblicz);
})

btnUsunPole.addEventListener('click', () => {
    if (liczbyInput.length > 0) {
        const ostatniePole = liczbyInput[liczbyInput.length - 1];
        polaPojemnik.removeChild(ostatniePole);
        liczbyInput = document.querySelectorAll('.liczba'); 
        Oblicz(); 
    }
});


function Oblicz(){
    liczbyInput = document.querySelectorAll('.liczba')

    const suma = obliczSume(liczbyInput);
    const srednia = obliczSrednia(liczbyInput);
    const min = znajdzMin(liczbyInput);
    const max = znajdzMax(liczbyInput);

    wynikiPojemnik.innerHTML = `Suma = ${suma}<br>
    Średnia = ${srednia}<br>
    Minimalna wartość = ${min}<br>
    Maksymalna wartość = ${max}`;
}


function obliczSume(liczbyInput){
    if(liczbyInput.length==0)
    {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < liczbyInput.length; i++) {
        const inputValue = parseFloat(liczbyInput[i].value);
        if (!isNaN(inputValue)) {
            sum += inputValue;
        }
    }
    return sum;
}

function obliczSrednia(liczbyInput){
    if(liczbyInput.length==0)
    {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < liczbyInput.length; i++) {
        const inputValue = parseFloat(liczbyInput[i].value);
        if (!isNaN(inputValue)) {
            sum += inputValue;
        }
    }
    return sum/liczbyInput.length;
}

function znajdzMin(liczbyInput){
    if(liczbyInput.length==0)
    {
        return 0;
    }

    const liczby = [];
    for (let i = 0; i < liczbyInput.length; i++) {
        const inputValue = parseFloat(liczbyInput[i].value);
        if (!isNaN(inputValue)) {
            liczby.push(inputValue);
        }
    }
    
    if(liczby.length==0){
        return 0;
    }

    const min = Math.min(...liczby);
    return min;
}

function znajdzMax(liczbyInput){
    if(liczbyInput.length==0)
    {
        return 0;
    }

    const liczby = [];
    for (let i = 0; i < liczbyInput.length; i++) {
        const inputValue = parseFloat(liczbyInput[i].value);
        if (!isNaN(inputValue)) {
            liczby.push(inputValue);
        }
    }

    if(liczby.length==0){
        return 0;
    }

    const max = Math.max(...liczby);
    return max;
}
