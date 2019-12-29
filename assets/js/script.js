var APIkey = "ab8bf4630ed81e21165709c4573cb202";
var city = "Seattle";
var cities = ["San Diego", "Riverside"];

$(document).ready(function(){
  
  displayWeatherInfo(city)
  renderButtons();
 

});

      //need to fix render and search

function renderButtons() {

  $("#city-list").empty();

  for (var i = 0; i < cities.length; i++) {
    
    var a = $("<button>");
    a.addClass("city");
    a.attr("data-name", cities[i]);
    a.text(cities[i]);          
    $("<br>").appendTo(a);
    $("#city-list").append(a);
  }
};
      
$("#search-city").on("submit", function(event) {
  event.preventDefault();
  console.log("search-city clicked");

  var citySearch = $("#search-city").val().trim();
  cities.push(citySearch);

  renderButtons();

$(document).on("click", ".city", displayWeatherInfo);

});


function displayWeatherInfo(city) {
  //var city = $(this).attr("data-name");
  // $("#current-weather").empty();
  // $("#fiveDayForecast").empty();

  var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    
  $.ajax({
    url: currentWeather,
    method: "GET"
  }).then(function(response) {

    console.log(currentWeather);
    console.log(response);
      
    var f = 0;
    var convertKtoF = function(temp){
      return f= ((temp - 273.15) * 1.80 + 32).toFixed(1);
    };

    var cityDiv = $(".current-city");
    var windDiv = $(".current-wind");
    var humidityDiv = $(".current-humidity");
    var tempDiv = $(".current-temp");
    var dateDiv = $(".current-date");

    var latitude = response.coord.lat;
    var longitude = response.coord.lon; 
    var cityID = response.id; 

    var iconcode = response.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    cityDiv.append("<h2>" + response.name + "</h2>");
    dateDiv.append("<h4>" + moment(response.coord.dt).format("dddd, MMMM Do, YYYY") + "<h4>");
    tempDiv.append("Temperature: " + convertKtoF(response.main.temp) + "\xB0" + "F");
    humidityDiv.append("Humidity: " + response.main.humidity + " %");
    windDiv.append("Wind: " + response.wind.speed + " MPH");
    $('#wicon').attr('src', iconurl);    

    var UVindex = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + latitude + "&lon=" + longitude;

    $.ajax({
      url: UVindex,
      method: "GET"
    }).then(function(response) {
        
      var uvDiv = $(".current-UV");
      uvDiv.append("UV Index: " + response.value);   
      });

    
    var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&APPID=" + APIkey;

      $.ajax({
        url: fiveDayForecast,
        method: "GET"
      }).then(function(response) {
    
        console.log(fiveDayForecast);
        console.log(response);
        console.log(moment(response.list[0].dt_txt).format("MMMM Do"));

        

        for (var i = 3; i < response.list.length; i += 8) {
          var iconSRC = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
          var fiveDayDiv = $("<div>").attr("class", "fiveDayCard");

          fiveDayDiv.attr("class", "card").attr("id", moment(response.list[i].dt)).appendTo(fiveDayDiv);
          $("<h5>").html(moment(response.list[i].dt_txt).format("MM / D")).appendTo(fiveDayDiv);
          $("<img>").attr("src", iconSRC).attr("class", "fiveDayIcon").appendTo(fiveDayDiv);
          $("<p>").html("Temp: " + convertKtoF(response.list[i].main.temp) + "\xB0" + "F").appendTo(fiveDayDiv);
          $("<p>").html("Humidity: "+response.list[i].main.humidity + " %").appendTo(fiveDayDiv);

          fiveDayDiv.appendTo("#fiveDayForecast");
          
      }; 

      renderButtons();


      // for (var i = 3; i < response.list.length; i += 8) {
      //     var iconSRC = "http://openweathermap.org/img/w/" + response.list[i].weather[0].id + ".png";

      //     $(".card5day").clone().attr("id", moment(response.list[i].dt))
      //     .find(".date5").html(moment(response.list[i].dt).format("MMMM Do")).end()
      //     .find(".icon5").attr("src", iconSRC).end()
      //     .find(".temp5").html("Temperature: " + convertKtoF(response.list[i].main.temp) + "\xB0" + "F").end()
      //     .find(".humidity5").html(response.list[i].main.humidity + " %").end()
      //     .appendTo("#fiveDayForecast");
      // };          
               
    });

  });
};