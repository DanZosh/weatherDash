// Assemble: Create/select DOM elements
var cityListEl = $(".list-group");
    console.log(cityListEl)
var citySearchEl = $("#citySearch")
    console.log(citySearchEl)
    console.log(citySearchEl.val().trim().toLowerCase())
var searchButtonEl = $(".fa-search");
    console.log(searchButtonEl)

//THESE ARE THE CARD DOM ELEMENTS
    var mainCardCity = $(".mainCardCity");
        console.log(mainCardCity)
    var mainCardTemperature = $(".mainCardTemperature");
        console.log(mainCardTemperature)
    var mainCardHumidity = $(".mainCardHumidity");
        console.log(mainCardHumidity)
    var mainCardWindSpeed = $(".mainCardWindSpeed");
        console.log(mainCardWindSpeed)
    var mainCardUVIndex = $(".mainCardUVIndex");
        console.log(mainCardUVIndex)

// Assemble: Create/select global variables 
// var citiesArray = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "atlanta"]
var citiesArray = []
    console.log(citiesArray)
var currentCity = {
    name:"",
    temperature:"",
    humidity:"",
    windSpeed:"",
    uvIndex:"",
}
        console.log(currentCity)

    init();
    //CHECK if there are already items stored in local storage.
    function init(){
        var storedCurrentCity = localStorage.getItem("locallyStoredCurrentCity");
            console.log(storedCurrentCity);
        if (storedCurrentCity && storedCurrentCity !== ""){
        //if true, then, replace currentCity with storedCurrentCity
        currentCity=JSON.parse(storedCurrentCity);
            
        }
        // renderMainCard();
    }

function storeCity(boop){
    localStorage.setItem(`${boop}`, JSON.stringify(currentCity)); 
}
function storeCityArray(){
    localStorage.setItem("storedCitiesArray", JSON.stringify(citiesArray)); 
}

function renderCities(){
//CLEAR the list on the page so we don't duplicate cities
    $(cityListEl).empty();
//FOR each city in the list, RENDER the city to the page
    for (let i = 0; i < citiesArray.length; i++) {
        var city = citiesArray[i];
    //CREATE dynamically an <li> item
        cityListEl.append($("<li>").text(city).addClass("list-group-item"));
    };
};

//CLICK FUNCTIONALITY
var newCity = searchButtonEl.on("click", function(event) {
    event.preventDefault();
    console.log(this)
    
// This line of code will grab the input from the `citySearchEl`
    // var cityLower = citySearchEl.val().trim().toLowerCase();
    //     console.log(cityLower)
     var cityCapitalized = citySearchEl.val().trim();
        console.log(cityCapitalized)
// The city from the `citySearchEl` is then added to our array
    citiesArray.push(cityCapitalized);

// Calling renderButtons which handles the processing of our `citiesArray`
    renderCities();
    getWeather(cityCapitalized);
    storeCity(cityCapitalized)
    return
});


  //AJAX CODE HERE
function getWeather(cityVar) {
    // console.log(this)
    // console.log($(this))
    var cityName = cityVar;
    // var cityName = "Atlanta";
        console.log(cityName)
    var apiKey = "85855026c109c5b4381b76fd68c05b8e"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
    // SET the `mainCard` ITEMS TO THE RESPONSE VALUES

            currentCity.name = response.name
            currentCity.temperature = response.main.temp
            currentCity.humidity = response.main.humidity
            currentCity.windSpeed = response.wind.speed
            currentCity.uvIndex = response.clouds.all
                console.log(currentCity)

        renderMainCard()
        storeCity(currentCity.name)
    });
};
function renderMainCard(){
    console.log(currentCity.name)
    $(mainCardCity).append($("<p>").text("City Name: "+currentCity.name));
    $(mainCardTemperature).append($("<p>").text("Temperature: "+currentCity.temperature));
    $(mainCardHumidity).append($("<p>").text("Humidity: "+currentCity.humidity));
    $(mainCardWindSpeed).append($("<p>").text("Wind Speed: "+currentCity.windSpeed));
    $(mainCardUVIndex).append($("<p>").text("UV Index: "+currentCity.uvIndex));
    };

var clearButtonEl = $(".clearButton")
console.log(clearButtonEl)
clearButtonEl.on("click", function(event) {
    // localStorage.setItem("locallyStoredTimeArray", JSON.stringify([]));
    localStorage.clear();
    window.location.reload();
});