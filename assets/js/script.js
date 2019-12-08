var APIkey = "ab8bf4630ed81e21165709c4573cb202";
var city = "San Diego";
var cities = [];
var cnt = "5";

$(document).ready(function(){

  var currentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&cnt=5";
   
  
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
    windDiv.append("Wind: " + response.wind.speed + "MPH");
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

          $("<div>").attr("class", "card").attr("id", moment(response.list[i].dt)).appendTo("#fiveDayForecast");
          $("<h5>").html(moment(response.list[i].dt_txt).format("MMMM Do")).appendTo("#fiveDayForecast");
          $("<img>").attr("src", iconSRC).appendTo("#fiveDayForecast");
          $("<p>").html("Temperature: " + convertKtoF(response.list[i].main.temp) + "\xB0" + "F").appendTo("#fiveDayForecast");
          $("<p>").html(response.list[i].main.humidity + " %").appendTo("#fiveDayForecast");
          
      }; 


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

    
    
 
 
function renderButtons() {

  $("#city-list").empty();

  for (var i = 0; i < cities.length; i++) {
    
    var a = $("<button>");
    a.addClass("city-btn");
    a.attr("data-name", city[i]);
    a.text(city[i]);
    $("#city-list").append(a);
  }
}

$("#search").on("click", function(event) {
  event.preventDefault();

  var citySearch = $("#search").val().trim();
  city.push(citySearch);

  renderButtons();
});

renderButtons();
})



    

  