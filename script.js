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

document.querySelector('#searchBtn').addEventListener('click', addCityName);
function addCityName(event) {
  let searchCityName = document.querySelector('#searchCityName').value;
  let li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.setAttribute('id', searchCityName);
  li.innerText = searchCityName;
  listGroup.prepend(li);
  li.addEventListener('click', cityNameSearch);
  document.querySelector('#searchCityName').value = '';
  
}

async function cityNameSearch(event) {
  let cityName = this.innerText;
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
  let dataCityName = data1.name;
  let currentCityName = document.createElement('div');
  let currentDate = moment().format('M/D/YYYY');
  currentCityName.innerText = dataCityName + ' ' + currentDate
  document.querySelector('#currentWeather').append(currentCityName)

};
