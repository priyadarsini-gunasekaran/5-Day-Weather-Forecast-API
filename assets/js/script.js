

// Parsing the values that is on the local storage
const parse_saved_cities = JSON.parse(localStorage.getItem('city'));

const input_cities = document.querySelector('#input_cities');
const cities_chosen_div = document.querySelector('#cities_chosen_div');
const cities_chosen_button = document.querySelector('#cities_chosen_button');

const city_name = document.querySelector('#city_name');
const img_weather_today = document.querySelector('#img_weather_today');
const temp = document.querySelector('#temp');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const uv_index = document.querySelector('#uv_index');

// Array that contain the city that have been chosen
const cities_saved = [];

// Ff the value on the local storage is differente than null, then active the get_cities_saved function
if (parse_saved_cities !== null){
  get_cities_saved();
}

// Getting the cities name that was storaged local and putting on the doc in a button
function get_cities_saved(){

// Creating one button, adding text content and adding data-value on the cities that was on the local storage
  for (i = 0; i < parse_saved_cities.length; i++){
    var button_cities = document.createElement('button');
    button_cities.setAttribute('data-value', parse_saved_cities[i].texts);
    button_cities.textContent = parse_saved_cities[i].texts;
    cities_chosen_div.append(button_cities);
  }
// If the user clicked on the button that cointain the citie name, then active the get_cities_saved function 
  cities_chosen_div.addEventListener('click', get_city_chosen);
}

// Adding the autocomplete on the input
$( function() {
    var availableTags = ['Oxford', 'Croydon', 'Birmingham', 'Kent', 'Slough', 'Reading'];
    $( "#input_cities" ).autocomplete({
      source: availableTags,
    });
  } );

// Checking if the input value is not a number or null, if it is, then pop up one alert saying that suppose to be one valid city on EUA
function get_city(){
  if (input_cities.value == ''){
    alert('Please, insert one city on EUA');
  } else if (!isNaN(input_cities.value)){
    alert('Insert one city on EUA');
  } else {

// Getting the value from the input and taking out all the space that user could put
  var city = input_cities.value.trim();

// Getting one button for the city, adding data and appending to the div on the dom
  var button_cities = document.createElement('button');
  button_cities.setAttribute('data-value', city);
  button_cities.textContent = city;
  cities_chosen_div.append(button_cities);

// Storing the cities in on object that will be push to an array
  var object_city = {
    texts: city
  }
  cities_saved.push(object_city);

// Setting the cities to the local storage
  localStorage.setItem('city', JSON.stringify(cities_saved));

// Cleaning the input after the user clicked to see the weather on one city
  input_cities.value = '';

// Getting the data from the weather API using the input value
  const url_api_weather = ('https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=6086d1f039acf014abeacd1138429b35&units=imperial&q='+city+',EUA')
  fetch(url_api_weather)
    .then(function (response){
// from stackoverflow: https://stackoverflow.com/questions/38235715/fetch-reject-promise-and-catch-the-error-if-status-is-not-ok
      if (!response.ok) {
        alert('API error');
      }
      return response.json();
    })
    .then(function (data){
      return get_wheater(data);
    })
  }
}

// Function that will be actived after get the data from the city that the user wrote on the input
function get_wheater(data){
// Adding Today's Day
  city_name.innerHTML = data.city.name+' '+moment().format("(MM-DD-YYYY)");  

// Adding the temp, wind, humidity and uv_index about today on the dom
  temp.innerHTML = ' '+data.list[0].main.temp+'ºF';
  wind.innerHTML = ' '+data.list[0].wind.speed+' MPH';
  humidity.innerHTML = ' '+data.list[0].main.humidity+'%';
  uv_index.innerHTML = ' '+'pending';

  // Adding the image that best represents the general weather of the day
  if (data.list[0].weather[0].main == "Clear"){
    img_weather_today.classList.remove('hide');
    img_weather_today.setAttribute('src', '../assets/images/sun.png');
    img_weather_today.setAttribute('alt', 'clear wheater');
  
  } else if (data.list[0].weather[0].main == "Clouds"){
    img_weather_today.classList.remove('hide');
    img_weather_today.setAttribute('src', '../assets/images/cloudy.png');
    img_weather_today.setAttribute('alt', 'clouds');
  
  } else if (data.list[0].weather[0].main == "Rain"){
    img_weather_today.classList.remove('hide');
    img_weather_today.setAttribute('src', '../assets/images/rain.png');
    img_weather_today.setAttribute('alt', 'rain');
  
  } else if (data.list[0].weather[0].main == "Snow"){
    img_weather_today.classList.remove('hide');
    img_weather_today.setAttribute('src', '../assets/images/snowy.png');
    img_weather_today.setAttribute('alt', 'snow');
  
  } else{
    img_weather_today.classList.remove('hide');
    img_weather_today.setAttribute('src', '../assets/images/extreme.png');
    img_weather_today.setAttribute('alt', 'extreme');
  }

// After adding the Image, then pass the data from the api to another function to add the next 5 days weather
  get_wheater_5(data);
}

function get_wheater_5(data){
  console.log("get_wheater_5");
// Doing a loop to add the temp, wind, humidity and one image to the next 5 days weather
  for (i = 1; i <= 5; i++){
      var time_5 = document.querySelector('#time'+[i]);
      time_5.textContent = moment().add([i],'days').format("MM/DD/YYYY");

// Selecting the temp, wind, humidity and image from the html file
      var temp_5 = document.querySelector('#temp'+[i]);
      var wind_5 = document.querySelector('#wind'+[i]);
      var humidity_5 = document.querySelector('#humidity'+[i]);
      var img_5 = document.querySelector('#img'+[i]) ;

      temp_5.textContent = ` ${data.list[i*7].main.temp} ºF`;
      wind_5.textContent = ` ${data.list[i*7].wind.speed} MPH`;
      humidity_5.textContent = ` ${data.list[i*7].main.humidity} %`;

// Adding the image that best represents the general weather of the day
      if (data.list[i*7].weather[0].main == "Clear"){
        img_5.classList.remove('hide');
       img_5.setAttribute('src', '../assets/images/sun.png'); 
        img_5.setAttribute('alt', 'clear wheater');
      
      } else if (data.list[i*7].weather[0].main == "Clouds"){
        img_5.classList.remove('hide');
       img_5.setAttribute('src', '../assets/images/cloudy.png');
        img_5.setAttribute('alt', 'clouds');
      
      } else if (data.list[i*7].weather[0].main == "Rain"){
        img_5.classList.remove('hide');
        img_5.setAttribute('src', '../assets/images/rain.png');
        img_5.setAttribute('alt', 'rain');
      
      } else if (data.list[i*7].weather[0].main == "Snow"){
        img_5.classList.remove('hide');
        img_5.setAttribute('src', '../assets/images/snow.png');
        img_5.setAttribute('alt', 'snow');
      
      } else{
        img_5.classList.remove('hide');
       img_5.setAttribute('src', '../assets/images/extreme.png');
        img_5.setAttribute('alt', 'extreme');
      }
  }
}

// If one of the cities that already been chosen is clicked, then show the value of it again
function get_city_chosen(e) {

// Targeting the button that was clicked and getting it the attribute
  var button_cities_attribute = e.target.getAttribute('data-value');
  
// City is equal the data-value that is on the button
  city = button_cities_attribute;

// Adding the var city to the API and getting the weather of the city
  const url_api_weather = ('https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=6086d1f039acf014abeacd1138429b35&units=imperial&q='+city+',EUA')

// Getting the data from the weather API using the input value
    fetch(url_api_weather)
      .then(function (response){
// from stackoverflow: https://stackoverflow.com/questions/38235715/fetch-reject-promise-and-catch-the-error-if-status-is-not-ok
        if (!response.ok) {
          alert('API error');
        }
        return response.json();
    })
      .then(function (data){
        return get_wheater(data);
    })
}

// Calling the get_wheater function after click on the button
button_city.addEventListener('click', get_city);