
let n = 1

document.getElementById('liczba1').addEventListener('change', () => {count()});

function count()
{
	let sum = 0
	let avg = 0
	let current = 0

	let i = 1

	let max = Number(document.getElementById('liczba1').value)
	let min = Number(document.getElementById('liczba1').value)
	
	let parent = document.getElementById('fields')
	
	for (const element of parent.children) 
	{
		const p = element.children[1]		
		current = Number(p.value)
		sum = sum + current
		if (current < min) min = current
		if (current > max) max = current
	}
	avg = sum / n

	document.getElementById('sum').value = sum.toLocaleString() 
	document.getElementById('avg').value = avg.toLocaleString() 
	document.getElementById('min').value = min.toLocaleString() 
	document.getElementById('max').value = max.toLocaleString() 
}

function add()
{
	let field = 'liczba' + (n+1)
	let parent = document.getElementById('fields')
	var li = document.createElement("li");
	var label = document.createElement('label')
	label.setAttribute('for', field)
	label.innerText = 'Liczba ' + (n+1) + ': '
	var input = document.createElement('input')
	input.setAttribute('type', 'number')
	input.setAttribute('id', field)
	input.setAttribute('name', field)
	input.addEventListener('change', (event) => {count()});
	var button = document.createElement('button')
	button.innerText = 'Usuń'
	button.addEventListener('click', (event) => { remove(event)})
	li.appendChild(label);
	li.appendChild(input);
	li.appendChild(button);
	parent.appendChild(li)
	n=n+1
}

function remove(event)
{
	console.log(event.target.parentElement.id)

	let parent = document.getElementById('fields')
	
	parent.removeChild(event.target.parentElement)	
	
	n = n - 1
	count()
}