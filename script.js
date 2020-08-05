// api key = b77386ac30431512966d88af2b144f30
// https://api.openweathermap.org/data/2.5/weather?appid=b77386ac30431512966d88af2b144f30&q={city name}
// https://api.openweathermap.org/data/2.5/uvi?appid=b77386ac30431512966d88af2b144f30&lat={lat}&lon={lon}
// https://api.openweathermap.org/data/2.5/onecall?appid=b77386ac30431512966d88af2b144f30&exclude=current,minutely,hourly&lat={lat}&lon={lon}

// on first loadup set current city to miami
// get history from local storage
// on search button click take input value and prepend to list of history and add to local storage
// take most recent history item and add to current weather api search
// await response and take lat and lon and add to uv and forcast api searches
// await all responses and display data
// display current city and date as a header in information card
// display temperature in fahrenheit from kalvin
// display humididy in percent
// display wind speed in mph
// display uv index with color based on number
// display 5 days of forecast in forcast card using more cards
// display date, weather img, temp and humidity

listGroup = document.querySelector('.list-group');
let history = [];
let currentCityName = '';
function checkLocalStorage() {
  if (localStorage.getItem('historyKey')) {
    history = JSON.parse(localStorage.getItem('historyKey'));
    currentCityName = history[0];
  } else {
    history = ['Miami'];
    currentCityName = history[0];
  }
}

function renderHistory() {
  document.querySelector('.list-group').innerHTML = '';
  for (let i = 0; i < history.length; i++) {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.setAttribute('id', history[i]);
    li.innerText = history[i];
    li.addEventListener('click', historyCityNameChange);
    listGroup.append(li);
  }
}
let searchCityName = '';

function titleCase(searchCityName) {
  searchCityName = searchCityName.toLowerCase().split(' ');
  for (let i = 0; i < searchCityName.length; i++) {
    searchCityName[i] = searchCityName[i].charAt(0).toUpperCase() + searchCityName[i].slice(1);
  }
  return searchCityName.join(' ');
}

function cityNameCheck(event) {
  for (let i = 0; i < history.length; i++) {
    if (searchCityName == history[i]) {
      history.splice(i, 1);
    }
  }
  history.unshift(searchCityName);
}

document.querySelector('#searchBtn').addEventListener('click', addCityName);
function addCityName(event) {
  searchCityName = document.querySelector('#searchCityName').value;
  searchCityName = titleCase(searchCityName);
  cityNameCheck();
  document.querySelector('#searchCityName').value = '';
  currentCityName = history[0];
  renderHistory();
  apiCall();
}

function historyCityNameChange() {
  searchCityName = this.innerText;
  cityNameCheck();
  currentCityName = history[0];
  renderHistory();
  apiCall();
};

async function apiCall(event) {
  const response1 = await fetch('https://api.openweathermap.org/data/2.5/weather?appid=b77386ac30431512966d88af2b144f30&q=' + currentCityName);
  if (response1.status != 200) {
    alert(currentCityName + ' is not a valid city name!');
    history.splice(0, 1);
    renderHistory();
    return;
  }
  const data1 = await response1.json();
  const cityLat = data1.coord.lat;
  const cityLon = data1.coord.lon;
  const response2 = await fetch('https://api.openweathermap.org/data/2.5/uvi?appid=b77386ac30431512966d88af2b144f30&lat=' + cityLat + '&lon=' + cityLon);
  const data2 = await response2.json();
  const response3 = await fetch('https://api.openweathermap.org/data/2.5/onecall?appid=b77386ac30431512966d88af2b144f30&exclude=current,minutely,hourly&lat=' + cityLat + '&lon=' + cityLon);
  const data3 = await response3.json();

  document.querySelector('#currentWeather').innerHTML = '';

  const dataCityName = data1.name;
  const currentCity = document.createElement('h2');
  const currentDate = moment().format('M/D/YYYY');
  currentCity.innerText = dataCityName + ' ' + currentDate;

  const currentWeatherImg = document.createElement('img');
  const currentWeatherId = data3.daily[0].weather[0].icon;
  currentWeatherImg.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentWeatherId + '@2x.png');
  currentCity.append(currentWeatherImg);

  document.querySelector('#currentWeather').append(currentCity);

  const kelvin = data1.main.temp;
  const temperature = (kelvin - 273.15) * 9 / 5 + 32;
  const currentTemperature = document.createElement('div');
  currentTemperature.innerText = 'Temperature: ' + temperature.toFixed(2); + ' F';
  document.querySelector('#currentWeather').append(currentTemperature);

  const humidity = data1.main.humidity;
  const currentHumidity = document.createElement('div');
  currentHumidity.innerText = 'Humidity: ' + humidity + '%';
  document.querySelector('#currentWeather').append(currentHumidity);

  const wind = data1.wind.speed;
  const currentWind = document.createElement('div');
  currentWind.innerText = 'Wind Speed: ' + wind + ' MPH';
  document.querySelector('#currentWeather').append(currentWind);

  const currentUV = document.createElement('div');
  currentUV.innerText = 'UV Index: ';
  document.querySelector('#currentWeather').append(currentUV);

  const UVdata = data2.value;
  const UVSpan = document.createElement('span');
  UVSpan.innerText = UVdata;
  UVSpan.classList.add('rounded');

  if (UVdata > 11) {
    UVSpan.classList.add('violet');
  } else if (UVdata > 8) {
    UVSpan.classList.add('red');
  } else if (UVdata > 6) {
    UVSpan.classList.add('orange');
  } else if (UVdata > 3) {
    UVSpan.classList.add('yellow');
  } else {
    UVSpan.classList.add('green');
  }

  currentUV.append(UVSpan);

  document.querySelector('#forcast').innerHTML = '';

  for (let i = 1; i < 6; i++) {
    const date = moment().add((i), 'days').format('M/D/YYYY');

    const col = document.createElement('div');
    col.setAttribute('class', 'col');
    document.querySelector('#forcast').append(col);

    const card = document.createElement('div');
    card.setAttribute('class', 'card text-white cardBG');
    col.append(card);

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body text-center');
    card.append(cardBody);

    const cardHead = document.createElement('h5');
    cardHead.setAttribute('class', 'card-title');
    cardHead.innerText = date;
    cardBody.append(cardHead);


    const weatherImg = document.createElement('img');
    const weatherId = data3.daily[i].weather[0].icon;
    weatherImg.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherId + '@2x.png');
    cardBody.append(weatherImg);

    const dailyKelvin = data3.daily[i].temp.day;
    const dailyTemperature = (dailyKelvin - 273.15) * 9 / 5 + 32;
    const tempDisplay = document.createElement('div');
    tempDisplay.innerText = 'Temp: ' + dailyTemperature.toFixed(2); + ' F';
    cardBody.append(tempDisplay);

    const dailyHumidity = data3.daily[i].humidity;
    const humidityDisplay = document.createElement('div');
    humidityDisplay.innerText = 'Humidity: ' + dailyHumidity + ' %';
    cardBody.append(humidityDisplay);


    localStorage.setItem('historyKey', JSON.stringify(history));
  }
};

checkLocalStorage();
renderHistory();
apiCall();
