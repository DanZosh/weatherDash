// Assemble: Create/select DOM elements
var cityListEl = $(".list-group");
    console.log(cityListEl)
var citySearchEl = $("#citySearch")
    console.log(citySearchEl)
    console.log(citySearchEl.val().trim().toLowerCase())
var searchButtonEl = $(".fa-search");
    console.log(searchButtonEl)
// Assemble: Create/select global variables 
// var citiesArray = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "atlanta"]
var citiesArray = []

function renderCities(){
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
    return
});

console.log(newCity)


  //AJAX CODE HERE
function getWeather(cityVar) {
    // console.log(this)
    // console.log($(this))
    var cityName = cityVar;
    // var cityName = "Atlanta";
        console.log($(cityName))
        console.log(cityName)
    var apiKey = "85855026c109c5b4381b76fd68c05b8e"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
    });
};