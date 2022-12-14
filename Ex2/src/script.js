const photos = [
	"img/pexels-james-wheeler-1578749.jpg",
	"img/pexels-pixabay-279574.jpg",
	"img/pexels-pixabay-417063.jpg",
	"img/pexels-sarah-schorer-835240.jpg",
]

const elSliderList = document.querySelector('#slider ul')
const elNavDots = document.querySelector('#nav-dots')

for (let index = 0; index < photos.length; index++) {
    const element = photos[index]

	//slides
	let img = document.createElement("img")
	img.setAttribute("alt", `Slide ${index+1}`)
	img.setAttribute("src", element)

	let div = document.createElement("div")
	div.appendChild(img)
	let li = document.createElement("li")
	li.appendChild(div)

	elSliderList.appendChild(li)

	// dots
	let label = document.createElement("label")
	label.classList.add("nav-dot")
	if (index == 0) label.classList.add("checked")
	
	elNavDots.appendChild(label)
}

var slideCount = document.querySelectorAll('#slider ul li').length
var slideWidth = document.querySelector('#slider ul li').clientWidth
var slideHeight = document.querySelector('#slider ul li').clientHeight

var sliderUlWidth = slideCount * slideWidth

var slide = 0

console.info(`${slideCount}, ${slideWidth}, ${slideHeight}, ${sliderUlWidth}`)

// one slide
const elSliderDiv = document.querySelector('#slider')
elSliderDiv.clientWidth = slideWidth
elSliderDiv.clientHeight = slideHeight


// cont * { one slide width }
//const elSliderList = document.querySelector('#slider ul')
elSliderList.clientWidth = sliderUlWidth
elSliderList.marginLeft = - 2 * slideWidth

function moveLeft() {
	if (slide == 0) return 

	slide -= 1

	const elSliderList = document.querySelector('#slider ul')

	elSliderList.animate( [
		{
				transform: `translateX(${-slide * slideWidth}px)`
		}
	]
	, {duration: 400, fill: 'forwards' } )
}

function moveRight() {
	if (slide == (slideCount - 1)) 
		slide = 0
	else
		slide += 1

	const elSliderList = document.querySelector('#slider ul')

	elSliderList.animate( [
		{
				transform: `translateX(${-slide * slideWidth}px)`
		}
	]
	, {duration: 400, fill: 'forwards' } )
}