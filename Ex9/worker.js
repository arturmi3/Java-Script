// 1. nie ma dostępnych: window, document, parent, struktury DOM 
// 2. zamknięcie workera z wewnątrz: self.close()
// 3. na worker wskazuje obiekt self===this)
// 4. importowanie zewnętrznych skryptów: importScript('script.js') 
//     - ścieżka jest relatywna do ścieżki workera!
// 5. workery mogą tworzyć swoje własne 'subworkery' - np. do dzielenia dużych zadań

console.log('Worker context:', { ' this': this, navigator })

watchMessages()
//counter()


function counter() {
    const hash = (Math.random() * 10000).toFixed()
    let i = 0
    setInterval(() => {
        i++
        // this.i = i
        postMessage(hash + '-' + i)
    }, 100)
}

function watchMessages() {
  addEventListener('message', function (e) {
    //console.log('watchMessages:', e)
    const url = urlForecast(e.data.lat, e.data.lon)
    // first time: without delay
    getWeather(url, e.data.id)

    setInterval(() => {
      getWeather(url, e.data.id)
    }, 1 * 60 * 1000);
  })

  function getWeather(url, id) {
    try {
      let weather = doRequest(url)
      //console.log(weather)

      const result = { main: weather.weather[0].main, description: weather.weather[0].description, icon: weather.weather[0].icon, humidity: weather.main.humidity, pressure: weather.main.pressure, temp: weather.main.temp, temp_max: weather.main.temp_max, temp_min: weather.main.temp_min }
      console.log('getWeather', id)
      postMessage({ id: id, weather: result })
    }
    catch (ex) {
    }
  }
}

function urlForecast(lat, lon) {
  const apiKey = '3f8e3696a9ca1c98f258c392f392e498'
  const part = ''
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}&lang=pl&units=metric`
}

function doRequest(url) {
  let resultData = {}
  let httpRequest = new XMLHttpRequest()
  httpRequest.onload = function() {
    //console.log(this)
    if (this.status != 0) {
      if (this.status !== 200) {
        throw new Error(`!request status = ${this.status}`)
      }
      resultData = JSON.parse(this.responseText)
      //console.log(resultData)
    }
  };  
  //console.log(url)
  httpRequest.open("GET", url, false)
  httpRequest.send()
  return resultData
}
