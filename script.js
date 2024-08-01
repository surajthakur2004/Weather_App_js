const userWeather = document.querySelector(".user_weather");
const searchWeather = document.querySelector(".search_weather");
const grantLocationTab = document.querySelector(".grant_location_container");
const searchTab = document.querySelector(".search_container");
const weatherInfo = document.querySelector(".weather_info");
const searchContainer = document.querySelector(".search_container");
const loader = document.querySelector(".loading-container");
const cityName = document.querySelector(".city-name");
const flag = document.querySelector(".flag");
const weatherDescp = document.querySelector(".weather-descp");
const weatherIcon = document.querySelector(".weather-icon");
const temp = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const cloud = document.querySelector(".cloud");
const humidity = document.querySelector(".humidity");
const permission = document.querySelector(".permission");
const search = document.querySelector(".search");
const inputCity = document.querySelector(".input-city");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


// initialise
let currentTab = userWeather;
currentTab.classList.add("current-tab")
// grantLocationTab.classList.add("active")
let backgroundImage ;
localStorage();


function showPosition(position)
{
  const userCoordinates = {
    lat : position.coords.latitude,
    log : position.coords.longitude
  }
  // console.log("lat :- " , lat);
  // console.log("lat :- " , lat);
  sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

function getLocation()
{
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition)
  }
  else{
    alert("Geolocation supprot not avilable in your device");
  }
}



function localStorage()
{
  const localCoordinates = sessionStorage.getItem("user-coordinates") 
  if(!localCoordinates)
  {
    grantLocationTab.classList.add('active');
    weatherInfo.classList.remove('active');
    document.addEventListener('click',getLocation)
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates)
{
  const {lat , log} = coordinates;
  grantLocationTab.classList.remove('active');
  loader.classList.add('active');

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}`
    );

    const data = await response.json();
    loader.classList.remove('active');
    weatherInfo.classList.add('active'); 
    renderWeatherInfo(data);
  }
  catch(err)
  {
    loader.classList.remove('active');
  }


}


function renderWeatherInfo(data)
{
  cityName.innerText = data?.name;
  weatherDescp.innerText = data?.weather?.[0]?.description;
  temp.innerText = `${(data?.main?.temp - 273.00).toFixed(2)} °C`;
  windSpeed.innerText = `${data?.wind?.speed}m/s`;
  cloud.innerText = `${data?.clouds?.all}%`;
  humidity.innerText =  `${data?.main?.humidity}%`;
  
  flag.src=`https://flagcdn.com/w20/${data?.sys?.country.toLowerCase()}.png`;

  weatherIcon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png` ;
  const backgroundImageId = data?.weather?.[0]?.id;
  setWeatherBackground(backgroundImageId);
}




function switchTab(newTab)
{
  if(currentTab != newTab)
  {
    currentTab.classList.remove("current-tab")
    currentTab = newTab;
    currentTab.classList.add("current-tab");

    // if(!searchWeather.classList.contains('active'))
    if(currentTab == searchWeather)
    {
      grantLocationTab.classList.remove('active');
      weatherInfo.classList.remove('active');
      searchContainer.classList.add('active');
    }
    else
    {
      searchContainer.classList.remove('active');
      localStorage();
    }

  }
}

userWeather.addEventListener('click', ()=>{
  switchTab(userWeather)
});

searchWeather.addEventListener('click', ()=>{
  switchTab(searchWeather)
});



async function fetchWeatherThroughCityName(cityName)
{
  grantLocationTab.classList.remove('active');
  loader.classList.add('active');
  grantLocationTab.classList.remove('active');

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    );


  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

    const data = await response.json();
    loader.classList.remove('active');
    weatherInfo.classList.add('active'); 
    renderWeatherInfo(data);
  }
  catch(err)
  {
  loader.classList.remove('active');
  grantLocationTab.classList.remove('active');
  weatherInfo.classList.remove('active');
  }
}



search.addEventListener('click',()=>{
  let city = inputCity.value;
  if(city == "") return;
  else{
    fetchWeatherThroughCityName(city);
  }
  
})

inputCity.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let city = inputCity.value;
    if (city == "") return;
    fetchWeatherThroughCityName(city);
  }
});

// bg image updation


const backgroundUrl ={
  2: "./asset/thunderstrom.jpg",
  3: "./asset/drizzle.jpg",
  5: "./asset/rain.jpg",
  6: "./asset/snow.jpg",
  7: "./asset/haze.jpg",
  8: "./asset/clear.jpg"
};
 
function setWeatherBackground(weatherId) {
  const backgroundImageIndex = Math.floor(weatherId / 100);
  const container = document.querySelector(".container");
  if (backgroundUrl[backgroundImageIndex]) {
    container.style.backgroundImage = `url(${backgroundUrl[backgroundImageIndex]})`;
    container.style.backgroundRepeat = "no-repeat";
    container.style.backgroundPosition = "center center";
    container.style.backgroundSize = "cover";
  } else {
    container.style.backgroundImage = `url(${backgroundUrl[7]})`;
  }
}

 