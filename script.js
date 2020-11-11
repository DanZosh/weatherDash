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
    var mainCardIcon= $(".mainCardIcon");
        // console.log(mainCardCity)
    var mainCardTemperature = $(".mainCardTemperature");
        // console.log(mainCardTemperature)
    var mainCardHumidity = $(".mainCardHumidity");
        // console.log(mainCardHumidity)
    var mainCardWindSpeed = $(".mainCardWindSpeed");
        // console.log(mainCardWindSpeed)
    var mainCardUVIndex = $(".mainCardUVIndex");
        // console.log(mainCardUVIndex)
//THESE ARE THE FORECAST DOM ELEMENTS        
    var fiveDayForecastEl = $("#fiveDayForecastEl")
        // console.log(fiveDayForecastEl)
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
    icon:"",
}

var nextDaysDate= []
    // console.log(nextDaysDate)
var nextDaysTemp= []
    // console.log(nextDaysTemp)
var nextDaysHumidity= []
    // console.log(nextDaysHumidity)
var nextDaysIcon= []
    // console.log(nextDaysIcon)

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
        getWeather("Miami");
        getFutureWeather("Miami")
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
            currentCity.icon = response.weather[0].icon
                // console.log(currentCity)
                // console.log(currentCity.icon)

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
    $(mainCardCity).append($("<p>").addClass("mainCardCity my-0").text(currentCity.name +" ("+ moment().format("M/D/YYYY")+")"));

    mainCardTemperature.innerHTML="";
    $(mainCardTemperature).empty()
    $(mainCardTemperature).append($("<p>").text("Temperature: "+(Math.ceil((currentCity.temperature - 273.15) * 1.80 + 32))+"F"));

    mainCardHumidity.innerHTML="";
    $(mainCardHumidity).empty()
    $(mainCardHumidity).append($("<p>").text("Humidity: "+currentCity.humidity+"%"));

    mainCardWindSpeed.innerHTML="";
    $(mainCardWindSpeed).empty()
    $(mainCardWindSpeed).append($("<p>").text("Wind Speed: "+currentCity.windSpeed+" MPH"));

// NOW FOR THE UV VALUE
    uvColorCode=""
        console.log(uvColorCode)
        console.log(currentCity)
        console.log(currentCity.uvIndex)
    if(currentCity.uvIndex<3){
        uvColorCode = "uvLow"
    }else if(currentCity.uvIndex >=3 && currentCity.uvIndex <6){
        uvColorCode = "uvMedium"
    }else if(currentCity.uvIndex >=6 && currentCity.uvIndex <8){
        uvColorCode = "uvHigh"
    }else if(currentCity.uvIndex >=8 && currentCity.uvIndex <11){
        uvColorCode = "uvVeryHigh"
    }else if(currentCity.uvIndex >11){
        uvColorCode = "uvExtremelyHigh"
    }
        console.log(uvColorCode)

    mainCardUVIndex.innerHTML="";
    $(mainCardUVIndex).empty()
    $(mainCardUVIndex).append($("<p>").text("UV Index: "+currentCity.uvIndex).addClass(uvColorCode))
    ;

    //NOW FOR THE ICON
    //EMPTY any previous `img` stored in the div
    $(mainCardIcon).empty()
    //Create an SRC link 
    var iconUrl = "http://openweathermap.org/img/w/" + currentCity.icon + ".png"
    //CREATE dynamically an image element with the attribute `src` and value of `iconURL`
    var imageIcon = $("<img>").attr("src", iconUrl).height(40).width(40)
    //APPEND the `mainCardIcon` div with `imageIcon`
    $(mainCardIcon).append(imageIcon);

    };


clearButtonEl.on("click", function(event) {
    // localStorage.setItem("locallyStoredTimeArray", JSON.stringify([]));
    localStorage.clear();
    window.location.reload();
});

//GET Forecast weather
function getFutureWeather(cityVar) {
//EMPTY the arrays of content from previous calls
    nextDaysDate= []
        console.log("next days date: " + nextDaysDate)
    nextDaysTemp= []
        console.log(nextDaysTemp)
    nextDaysHumidity= []
        console.log(nextDaysHumidity)
    nextDaysIcon= []
        console.log(nextDaysIcon)




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
//GET the next unix dates and convert to something readable
            var nextDate = moment(response.list[i].dt,"X").format("M/D/YY");
                // console.log(nextDate);
            nextDaysDate.push(nextDate);
// GET the next temperatures and convert to F
            var nextTemp = Math.round((((((response.list[i].main.temp)- 273.15) * 1.80) + 32)));
                // console.log(nextTemp);
            nextDaysTemp.push(nextTemp);
// GET the next humidity
            var nextHumidity = response.list[i].main.humidity;
                // console.log(nextHumidity);
            nextDaysHumidity.push(nextHumidity);
// GET the next icons
            var nextIcon = response.list[i].weather[0].icon;
                // console.log(nextIcon);
            nextDaysIcon.push(nextIcon);
        }
            console.log("next days date: " + nextDaysDate);
            console.log(nextDaysTemp);
            console.log(nextDaysHumidity);
            console.log(nextDaysIcon);
            renderFutureWeather()
    });
};

//RENDER future weather
function renderFutureWeather(){
//LOOP through the `datei` cards and append with matching index of `nextDaysDate`
    for (let i = 0; i < 5; i++) {
        $("#date"+i).innerHTML="";
        $("#date"+i).empty()
        $("#date"+i).append($("<p>").text(nextDaysDate[i]))
        
    }
//LOOP through the `tempi` cards and append with matching index of `nextDaysTemp`
    for (let i = 0; i < 5; i++) {
        $("#temp"+i).innerHTML="";
        $("#temp"+i).empty()
        $("#temp"+i).append($("<p>").text("Temp: "+nextDaysTemp[i]+" F"))
        
    }
//LOOP through the `humidity` cards and append with matching index of `nextDaysHumidity`
    for (let i = 0; i < 5; i++) {
        $("#humidity"+i).innerHTML="";
        $("#humidity"+i).empty()
        $("#humidity"+i).append($("<p>").text("Humidity: "+nextDaysHumidity[i]+" %"))
        
    }

//LOOP through the `icon` cards and append with matching index of `nextDaysIcon`

for (let i = 0; i < 5; i++) {
//EMPTY any previous `img` stored in the div
    $("#icon"+i).empty()
    console.log($("#icon"+i))
//Create an SRC link 
    var iconUrlForecast = "http://openweathermap.org/img/w/" + nextDaysIcon[i] + ".png";
        console.log(iconUrlForecast)
//CREATE dynamically an image element with the attribute `src` and value of `iconURL`
    var imageIconForecast = $("<img>").attr("src", iconUrlForecast).height(40).width(40);
        console.log(imageIconForecast)
//APPEND the `"#icon"+i` div with `imageIcon`
    $("#icon"+i).append(imageIconForecast);
}

//RESOURCE BELOW
    // //NOW FOR THE ICON
    // //EMPTY any previous `img` stored in the div
    // $(mainCardIcon).empty()
    // //Create an SRC link 
    // var iconUrl = "http://openweathermap.org/img/w/" + currentCity.icon + ".png"
    // //CREATE dynamically an image element with the attribute `src` and value of `iconURL`
    // var imageIcon = $("<img>").attr("src", iconUrl).height(40).width(40)
    // //APPEND the `mainCardIcon` div with `imageIcon`
    // $(mainCardIcon).append(imageIcon);



    };