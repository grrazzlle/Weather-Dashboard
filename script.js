//api key = b77386ac30431512966d88af2b144f30
//https://api.openweathermap.org/data/2.5/weather?appid=b77386ac30431512966d88af2b144f30&q={city name}
//https://api.openweathermap.org/data/2.5/uvi/forecast?appid=b77386ac30431512966d88af2b144f30&lat={lat}&lon={lon}
//https://api.openweathermap.org/data/2.5/onecall?appid=b77386ac30431512966d88af2b144f30&exclude=current,minutely,hourly&lat={lat}&lon={lon}

//on first loadup set current city to miami
//get history from local storage
//on search button click take input value and prepend to list of history and add to local storage
//take most recent history item and add to current weather api search
//await response and take lat and lon and add to uv and forcast api searches
//await all responses and display data
//display current city and date as a header in information card
//display temperature in fahrenheit from kalvin
//display humididy in percent
//display wind speed in mph
//display uv index with color based on number
//display 5 days of forecast in forcast card using more cards
//display date, weather img, temp and humidity

listGroup = document.querySelector('.list-group');
let cityName = ''

document.querySelector('#searchBtn').addEventListener('click', addCityName);
function addCityName(event) {
  let searchCityName = document.querySelector('#searchCityName').value;
  let li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.setAttribute('id', searchCityName);
  cityName = searchCityName;
  li.innerText = searchCityName;
  listGroup.prepend(li);
  li.addEventListener('click', historyCityNameChange);
  document.querySelector('#searchCityName').value = '';
  apiCall();
}

function historyCityNameChange() {
  cityName = this.innerText;
  apiCall();
};


async function apiCall(event) {
  let response1 = await fetch('https://api.openweathermap.org/data/2.5/weather?appid=b77386ac30431512966d88af2b144f30&q=' + cityName);
  let data1 = await response1.json();
  console.log(data1)
  let cityLat = data1.coord.lat;
  let cityLon = data1.coord.lon;
  let response2 = await fetch('https://api.openweathermap.org/data/2.5/uvi/forecast?appid=b77386ac30431512966d88af2b144f30&lat=' + cityLat +'&lon=' + cityLon);
  let data2 = await response2.json();
  console.log(data2)
  let response3 = await fetch('https://api.openweathermap.org/data/2.5/onecall?appid=b77386ac30431512966d88af2b144f30&exclude=current,minutely,hourly&lat=' + cityLat +'&lon=' + cityLon);
  let data3 = await response3.json();
  console.log(data3)

  document.querySelector('#currentWeather').innerHTML = '';

  let dataCityName = data1.name;
  let currentCity = document.createElement('div');
  let currentDate = moment().format('M/D/YYYY');
  currentCity.innerText = dataCityName + ' ' + currentDate;
  document.querySelector('#currentWeather').append(currentCity);

  let kelvin = data1.main.temp;
  let temperature = (kelvin - 273.15) * 9/5 + 32;
  let currentTemperature = document.createElement('div');
  currentTemperature.innerText = 'Temperature: ' + temperature + ' F';
  document.querySelector('#currentWeather').append(currentTemperature);

  let humidity = data1.main.humidity;
  let currentHumidity = document.createElement('div');
  currentHumidity.innerText = 'Humidity: ' + humidity + '%';
  document.querySelector('#currentWeather').append(currentHumidity);

  let wind = data1.wind.speed;
  let currentWind = document.createElement('div');
  currentWind.innerText = 'Wind Speed: ' + wind + ' MPH';
  document.querySelector('#currentWeather').append(currentWind);

  let UV = data2[0].value;
  let currentUV = document.createElement('div');
  currentUV.innerText = 'UV Index: ' + UV;
  document.querySelector('#currentWeather').append(currentUV);
};
