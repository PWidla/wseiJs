const apiKey = "7ac526fedac2a5bb9b153a3108b149fc";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const cardsContainer = document.querySelector("#cards-container");

localStorage.clear();
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    alert("Invalid city name");
  } else {
    var data = await response.json();
    localStorage.setItem(`card-${data.name}`, data.name);
    console.log(localStorage.length);
    console.log(Object.entries(localStorage));

    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.id = `card-${data.name}`;

    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather");

    const weatherIcon = document.createElement("img");
    weatherIcon.src = `weather-app-img/images/${data.weather[0].main}.png`;
    weatherIcon.alt = data.weather[0].main;
    weatherIcon.classList.add("weather-icon");

    const tempH1 = document.createElement("h1");
    tempH1.classList.add("temp");
    tempH1.textContent = `${Math.round(data.main.temp)}°C`;

    const cityH2 = document.createElement("h2");
    cityH2.classList.add("city");
    cityH2.textContent = data.name;

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    const colDiv1 = document.createElement("div");
    colDiv1.classList.add("col");

    const humidityImg = document.createElement("img");
    humidityImg.src = "weather-app-img/images/humidity.png";

    const humidityDiv = document.createElement("div");

    const humidityP = document.createElement("p");
    humidityP.classList.add("humidity");
    humidityP.textContent = `${data.main.humidity}%`;

    const humidityTextP = document.createElement("p");
    humidityTextP.textContent = "Humidity";

    humidityDiv.appendChild(humidityImg);
    humidityDiv.appendChild(humidityP);
    humidityDiv.appendChild(humidityTextP);

    colDiv1.appendChild(humidityDiv);

    const colDiv2 = document.createElement("div");
    colDiv2.classList.add("col");

    const windImg = document.createElement("img");
    windImg.src = "weather-app-img/images/wind.png";

    const windDiv = document.createElement("div");

    const windP = document.createElement("p");
    windP.classList.add("wind");
    windP.textContent = `${data.wind.speed} km/h`;

    const windTextP = document.createElement("p");
    windTextP.textContent = "Wind speed";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.id = "deleteButton";
    deleteButton.onclick = () => handleDeleteClick(data.name);

    windDiv.appendChild(windImg);
    windDiv.appendChild(windP);
    windDiv.appendChild(windTextP);

    colDiv2.appendChild(windDiv);

    newCard.appendChild(weatherDiv);
    newCard.appendChild(deleteButton);

    weatherDiv.appendChild(weatherIcon);
    weatherDiv.appendChild(tempH1);
    weatherDiv.appendChild(cityH2);
    weatherDiv.appendChild(detailsDiv);

    detailsDiv.appendChild(colDiv1);
    detailsDiv.appendChild(colDiv2);

    cardsContainer.appendChild(newCard);
  }
}

function handleDeleteClick(city) {
  const confirmation = confirm(
    `Are you sure you want to delete card for city ${city}?`
  );
  if (confirmation) {
    localStorage.removeItem(`card-${city}`);
    const cardToDelete = document.getElementById(`card-${city}`);
    if (cardToDelete) {
      cardToDelete.remove();
    }
  }
}
