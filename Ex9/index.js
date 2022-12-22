

const apiKey = "3f8e3696a9ca1c98f258c392f392e498"

function workerCros(url) {
  const iss = "importScripts('" + url + "');";
  return URL.createObjectURL(new Blob([iss]));
}


function urlLocation(cityName, stateCode, countryCode) {
  let q = `${cityName}`
  if (stateCode) q += `,${stateCode}`
  if (countryCode) q += `,${countryCode}`
  let limit = 1
  return `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${apiKey}`
}

function urlForecast(lat, lon) {
  let part = ""
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}&lang=pl`
}

function doRequest(url) {
  let resultData = {}
  let httpRequest = new XMLHttpRequest()
  httpRequest.onload = function() {
    console.log(this)
    if (this.status != 0) {
      if (this.status !== 200) {
        throw new Error(`!request status = ${this.status}`)
      }
      resultData = JSON.parse(this.responseText)
      console.log(resultData)
    }
  };  
  httpRequest.open("GET", url, false)
  httpRequest.send()
  return resultData
}


function clickButton() {
  let url = urlLocation("Bochnia", null, "PL") 
  let location = doRequest(url)
  console.log(location)

  url = urlForecast(location[0].lat, location[0].lon)
  let weather = doRequest(url)
  console.log(weather)
  let w = weather.weather[0]
  alert(`${w.description}, ${w.icon}`)
}