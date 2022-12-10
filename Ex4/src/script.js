
load_notes()

function load_notes() {
    console.log('load_notes')
    let keys = []
    for (var key in localStorage) {
        if (key.match('^Note:\\d+$')) 
            keys.push(key)    
    }

    let table = document.getElementById("table")
    table.innerHTML = '';   // removes  children

    let pinned = document.getElementById("pinned")
    pinned.innerHTML = '';   // removes  children

    keys.forEach(key => {
        let jsonNote = localStorage.getItem(key)
        var note = JSON.parse(jsonNote);
        
        if (note.pin == true)
            pinned.appendChild(addNoteReadonly(note))    
        else
            table.appendChild(addNoteReadonly(note))    
    });
}

function save_data() {
    let newNote = document.getElementById("new_note");
    
    let title = newNote.querySelector("input[name='title']").value
    let content = newNote.querySelector("textarea[name='content']").value
    let colour = newNote.querySelector("input[name='colour']").value
    let created = new Date().toISOString()
    let pin = newNote.querySelector("input[name='pin']").checked

    const myObj = {title: title, content: content, colour: colour, created: created, pin: pin};
    const myJSON = JSON.stringify(myObj);

    let key = `Note:${Date.now()}`

    console.log(key, myJSON)

    localStorage.setItem(key, myJSON);
}

function addNoteReadonly(note) {
    let form = document.createElement('form')
    form.classList.add('cell')
    form.classList.add('readonly')
    
    // title
    let input1 = document.createElement('input')
    input1.setAttribute('type', 'text')
    input1.readOnly = true
    input1.setAttribute('value', note.title)

    let label1 = document.createElement('label')
    label1.appendChild(document.createTextNode('Title: '))
    label1.appendChild(input1)

    form.appendChild(label1)
    form.appendChild(document.createElement('br'))

    // content
    let input2 = document.createElement('input')
    input2.setAttribute('type', 'text')
    input2.readOnly = true
    input2.setAttribute('value', note.content)

    let label2 = document.createElement('label')
    label2.appendChild(document.createTextNode('Content: '))
    label2.appendChild(input2)

    form.appendChild(label2)
    form.appendChild(document.createElement('br'))

    // colour
    form.style.backgroundColor = note.colour

    // date
    let input3 = document.createElement('input')
    input3.setAttribute('type', 'datetime-local')
    input3.readOnly = true
    
    let isoString = note.created
    let created = isoString.substring(0, isoString.indexOf("T") + 6);
    console.log(`created= ${created}`)
    input3.setAttribute('value', created)

    let label3 = document.createElement('label')
    label3.appendChild(document.createTextNode('Created: '))
    label3.appendChild(input3)

    form.appendChild(label3)
    form.appendChild(document.createElement('br'))

    return form
}


function clear_table() {
    console.log('load_notes')
    let keys = []
    for (var key in localStorage) {
        if (key.match('^Note:\\d+$')) 
            keys.push(key)    
    }
    keys.forEach(key => {
        localStorage.removeItem(key)
    });

    load_notes()
}