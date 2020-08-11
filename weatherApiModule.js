const https = require("https");
const api = require(__dirname + "/config.js");

exports.getWeather = function(city, unit) {

  if (city == "") {
    city = "delhi";
  }

  if (unit == "") {
    unit = "metric";
  }

  let weatherObject = new Object();



  const apiKey = api.weatherApi;
  const endPoint = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;

  https.get(endPoint, function(res) {

    res.on("data", function(data) {
      const weatherData = JSON.parse(data);
      weatherObject.err = weatherData.cod;
      if (weatherObject.err == "404") {
        console.log("err");
      } else {


        if (unit == "metric") {
          unSymb = "°C"
        } else {
          unSymb = "°F"
        }


        weatherObject.temp = weatherData.main.temp + unSymb;
        weatherObject.feels_like = weatherData.main.feels_like + unSymb;
        weatherObject.description = weatherData.weather[0].description;
        weatherObject.imageURI = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        weatherObject.city = weatherData.name;


        switch (weatherData.weather[0].icon) {
          case "01d":
            weatherObject.backImg = api.oneD;
            weatherObject.backBodyImg = api.oneDBlur;
            break;
          case "01n":
            weatherObject.backImg = api.oneN;
            weatherObject.backBodyImg = api.oneNBlur;
            weatherObject.getColor = "#fff";
            break;
          case "02d":
            weatherObject.backImg = api.twoD;
            weatherObject.backBodyImg = api.twoDBlur;
            break;
          case "02n":
            weatherObject.backImg = api.twoN;
            weatherObject.backBodyImg = api.twoNBlur;
            weatherObject.getColor = "#fff";
            break;
          case "03d":
          case "03n":
            weatherObject.backImg = api.three;
            weatherObject.backBodyImg = api.threeBlur;
            weatherObject.getColor = "#000";
            break;
          case "04d":
          case "04n":
            weatherObject.backImg = api.four;
            weatherObject.backBodyImg = api.fourBlur;
            weatherObject.getColor = "#000";
            break;
          case "09d":
          case "09n":
            weatherObject.backImg = api.nine;
            weatherObject.backBodyImg = api.nineBlur;
            weatherObject.getColor = "#fff";
            break;
          case "10d":
            weatherObject.backImg = api.tenD;
            weatherObject.backBodyImg = api.tenDBlur;
            break;
          case "10n":
            weatherObject.backImg = api.tenN;
            weatherObject.backBodyImg = api.tenNBlur;
            weatherObject.getColor = "#fff";
            break;
          case "11d":
          case "11n":
            weatherObject.backImg = api.eleven;
            weatherObject.backBodyImg = api.elevenBlur;
            weatherObject.getColor = "#fff";
            break;
          case "13d":
          case "13n":
            weatherObject.backImg = api.thirteen;
            weatherObject.backBodyImg = api.thirteenBlur;
            weatherObject.getColor = "#000"
            break;
          case "50d":
          case "50n":
            weatherObject.backImg = api.fifty;
            weatherObject.backBodyImg = api.fiftyBlur;
            break;
          default:
            console.log(weatherData.weather[0].icon);

        }


      }

    });

  });

  if (Object.keys(weatherObject).length === 0) {
    console.log("Weather Updating");
  }

  return weatherObject;



}
