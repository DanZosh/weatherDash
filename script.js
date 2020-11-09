// Assemble: Create/select DOM elements
var cityListEl = $(".list-group");
    // console.log(cityListEl)
var citySearchEl = $("#citySearch")
    // console.log(citySearchEl)
    // console.log(citySearchEl.val().trim().toLowerCase())
var searchButtonEl = $(".fa-search");
    // console.log(searchButtonEl)
var clearButtonEl = $(".clearButton")
    // console.log(clearButtonEl)
//THESE ARE THE CARD DOM ELEMENTS
    var mainCardCity = $(".mainCardCity");
        // console.log(mainCardCity)
    var mainCardTemperature = $(".mainCardTemperature");
        // console.log(mainCardTemperature)
    var mainCardHumidity = $(".mainCardHumidity");
        // console.log(mainCardHumidity)
    var mainCardWindSpeed = $(".mainCardWindSpeed");
        // console.log(mainCardWindSpeed)
    var mainCardUVIndex = $(".mainCardUVIndex");
        // console.log(mainCardUVIndex)

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
    lat:"",
    lon:"",
}
var nextDays= []
    console.log(nextDays)


//START
    init();
    //CHECK if there is already a `storedCitiesArray` in local storage.
    function init(){
        var storedCitiesArray = localStorage.getItem("storedCitiesArray");
            console.log(storedCitiesArray);
        if (storedCitiesArray && storedCitiesArray !== ""){
        //if true, then, replace `citiesArray` with `storedCitiesArray`
        citiesArray=JSON.parse(storedCitiesArray);
        }
        renderCities();
    }
//STORE locally the current `currentCity`
function storeCity(boop){
    localStorage.setItem(`${boop}`, JSON.stringify(currentCity)); 
}
//STORE locally our `citiesArray`
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
    citiesArray.unshift(cityCapitalized);

// Calling renderButtons which handles the processing of our `citiesArray`
    renderCities();
    getWeather(cityCapitalized);
    getFutureWeather(cityCapitalized)
    storeCity(cityCapitalized);
    storeCityArray();
    return
});

//GET weather conditions
function getWeather(cityVar) {
    var cityName = cityVar;
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
            currentCity.lat = response.coord.lat
            currentCity.lon = response.coord.lon
                console.log(currentCity)

//GET the UV Index, we need to do this separately as far as i can tell
    var apiKey = "85855026c109c5b4381b76fd68c05b8e"
    var queryURLUV = "http://api.openweathermap.org/data/2.5/uvi?lat="+(currentCity.lat)+"&lon="+(currentCity.lon)+"&appid="+apiKey
    console.log(queryURLUV)
    $.ajax({
        url: queryURLUV,
        method: "GET"
    }).then(function(response) {
        console.log(response)
    // // SET the `mainCard` UV TO THE RESPONSE VALUE
            currentCity.uvIndex = response.value
                console.log(currentCity.uvIndex)
        renderMainCard();
        storeCity(currentCity.name);
        storeCityArray();
    });
});
};

//RENDER the content to the MAIN CARD FOR CURRENT WEATHER
function renderMainCard(){
    console.log(currentCity.name)
    //DAN NOTE: there is an opportunity here to create an array and do a for loop for all these short functions; low priority, get it functioning first and come back if you can.

    mainCardCity.innerHTML="";
    $(mainCardCity).empty()
    $(mainCardCity).append($("<p>").text("City Name: "+currentCity.name));

    mainCardTemperature.innerHTML="";
    $(mainCardTemperature).empty()
    $(mainCardTemperature).append($("<p>").text("Temperature: "+(Math.ceil((currentCity.temperature - 273.15) * 1.80 + 32))+"F"));

    mainCardHumidity.innerHTML="";
    $(mainCardHumidity).empty()
    $(mainCardHumidity).append($("<p>").text("Humidity: "+currentCity.humidity+"%"));

    mainCardWindSpeed.innerHTML="";
    $(mainCardWindSpeed).empty()
    $(mainCardWindSpeed).append($("<p>").text("Wind Speed: "+currentCity.windSpeed+" MPH"));

    mainCardUVIndex.innerHTML="";
    $(mainCardUVIndex).empty()
    $(mainCardUVIndex).append($("<p>").text("UV Index: "+currentCity.uvIndex));
    };


clearButtonEl.on("click", function(event) {
    // localStorage.setItem("locallyStoredTimeArray", JSON.stringify([]));
    localStorage.clear();
    window.location.reload();
});

//GET Forecast weather
function getFutureWeather(cityVar) {
    var cityName = cityVar;
        console.log(cityName)
    var apiKey = "85855026c109c5b4381b76fd68c05b8e"
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName + "&appid=" + apiKey;
    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response.list)
        //GET the unix dates
        for (let i = 0; i < 40; i+=8) {
            var element = moment(response.list[i].dt,"X").format("MMM Do, YYYY HH");
                console.log(element);
            nextDays.push(element);
        }
            console.log(nextDays)

    });
};

// TEST JUNK BELOW
// timeVar=1549312452
// convertUnix()
// // function convertUnix(timeVar){
//     var unixFormat = moment(1604901600,"X")
//     // console.log(unixFormat.format("X"))
//     console.log(unixFormat.format("MMM Do, YYYY HH"));    var unixFormat = moment(1604912400,"X")
//     // console.log(unixFormat.format("X"))
//     console.log(unixFormat.format("MMM Do, YYYY HH"));    var unixFormat = moment(1604923200,"X")
//     // console.log(unixFormat.format("X"))
//     console.log(unixFormat.format("MMM Do, YYYY HH"));    var unixFormat = moment(1604934000,"X")
//     // console.log(unixFormat.format("X"))
//     console.log(unixFormat.format("MMM Do, YYYY HH"));    var unixFormat = moment(1604944800,"X")
//     // console.log(unixFormat.format("X"))
//     console.log(unixFormat.format("MMM Do, YYYY HH"));
// }