

const apiKey = '3f8e3696a9ca1c98f258c392f392e498'
const storageKey = 'pogodynka03'
let lastId = 0

function Record(id, name, country, lat, lon) {
  this.id = id
  this.name = name
  this.country = country
  this.lat = lat
  this.lon = lon
  this.lastTime = null
  this.weather = null
}

const LIMIT = 10
const Records = JSON.parse(localStorage[storageKey] || "[]")
//const Records = []

Records.forEach(record => {
  const divId = `Rec${record.id}`
  const newBox = buildBox(record, divId)
  if (record.id > lastId) lastId = record.id
  document.querySelector("#container").appendChild(newBox)
  const worker = createWorker()
  worker.postMessage(record)
});

function createWorker() {
  // url to worker.js
  const href = new URL('./worker.js', window.location).href
  const iss = "importScripts('" + href + "');";
  const workerUrl = URL.createObjectURL(new Blob([iss]))
  const worker = new Worker(workerUrl)
  worker.addEventListener('message', onWorkerMessage)
  return worker
}
function onWorkerMessage(e) {
  //document.querySelector('#box').innerHTML = e.data + '<br>' + document.querySelector('#box').innerHTML
  //console.log('onWorkerMessage', e)
  //console.log('data from worker', e.data)
  const record = Records.find((o) => o.id === e.data.id)
  if(record) {
    record.weather = e.data.weather
    record.lastTime = new Date()

    // replace box
    const divId = `Rec${record.id}`
    const newBox = buildBox(record, divId)
    const oldBox = document.getElementById(divId)
    oldBox.parentElement.replaceChild(newBox, oldBox)
    
    // storage
    localStorage[storageKey] = JSON.stringify(Records)
  }
}

function urlLocation(cityName, stateCode, countryCode) {
  let q = `${cityName}`
  if (stateCode) q += `,${stateCode}`
  if (countryCode) q += `,${countryCode}`
  let limit = 1
  return `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${apiKey}`
}

function urlForecast(lat, lon) {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}&lang=pl&units=metric`
}

function ulrIcon(icon) {
  //return `http://openweathermap.org/img/wn/${icon}@2x.png`
  return `http://openweathermap.org/img/wn/${icon}.png`
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
  httpRequest.open("GET", url, false)
  httpRequest.send()
  return resultData
}

function addCity() {
  let searchCountry = document.querySelector("#country")
  let searchCity = document.querySelector("#city")  

  //console.log(searchCountry.value, searchCity.value)
  if ((searchCountry.value) &&  (searchCity.value)) {
    const url = urlLocation(searchCity.value, null, searchCountry.value)
    try {
      const location = doRequest(url)
      if (location && location.length > 0) {
        const firstLoc = location[0]
        //console.log(firstLoc.name)
        //console.log(firstLoc.lat)
        //console.log(firstLoc.lon)

        if(Records.length < LIMIT) {
          const record = new Record(++lastId, firstLoc.name, firstLoc.country, firstLoc.lat, firstLoc.lon)
          //console.log(record)          
          const divId = `Rec${record.id}`
          const newBox = buildBox(record, divId)
          document.querySelector("#container").appendChild(newBox)
          Records.push(record) // add worker
          const worker = createWorker()
          worker.postMessage(record)
        }
        else {
          alert("Can not add more!")
        }

      }
      else {
        alert("Not found!")
      }
    }
    catch(e) {
      alert(e)
    }
  }
}

function buildBox(record, divId) {
  const box = document.createElement("div")
  box.classList.add("box")
  box.setAttribute("id", divId)
  const x = document.createElement("button")
  x.innerHTML = "X"
  x.onclick = function(e) {
    //console.log(e)    
    document.querySelector("#container").removeChild(this.parentElement)      
  }
  box.appendChild(x)
  box.appendChild(document.createTextNode("\u00A0" + `${record.name}, ${record.country}`))
  box.appendChild(document.createElement("br"))
  box.appendChild(document.createElement("br"))
  const image = document.createElement("img")
  if(record.weather) {
    image.setAttribute("src", ulrIcon(record.weather.icon))
  }
  image.setAttribute("alt", "czekaj...")
  box.appendChild(image)
  
  if(record.weather) {        
    const temp = document.createElement('span')
    temp.classList.add("temp")
    temp.textContent = `${record.weather.temp}\u2103`
    box.appendChild(temp)
    box.appendChild(document.createElement("br"))
    box.appendChild(document.createTextNode(`(min:${record.weather.temp_min}, maks:${record.weather.temp_max})`))
    box.appendChild(document.createElement("br"))
    box.appendChild(document.createTextNode(`${record.weather.description}`))
    box.appendChild(document.createElement("br"))
    box.appendChild(document.createTextNode(`wilgotność: ${record.weather.humidity}`))
    box.appendChild(document.createElement("br"))
    box.appendChild(document.createTextNode(`ciśnienie: ${record.weather.pressure}`))
    box.appendChild(document.createElement("br"))
    const s = record.lastTime.toLocaleString('pl-PL')
    box.appendChild(document.createTextNode(`(czas: ${record.lastTime.toLocaleString()})`))
    //const result = { main: weather.weather[0].main, description: weather.weather[0].description, icon: weather.weather[0].icon, humidity: weather.main.humidity, pressure: weather.main.pressure, temp: weather.main.temp, temp_max: weather.main.temp_max, temp_min: weather.main.temp_min}    
  }

  return box
}
