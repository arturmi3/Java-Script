var recorder = Array(4)
recorder[0] = []
recorder[1] = []
recorder[2] = []
recorder[3] = []

var metronom = null
var metronomIsPlaying = false
var recordingTrack = null
var startRecording
var startPlaying

const State = {
    Stop: 'Stop',
    Playing: 'Playing',
    Recording: 'Recording'
}

var currentState = State.Stop

const KeyToSound = {
    'a': 's1',
    's': 's2',
    'd': 's3',
    'f': 's4',
    'g': 's5',
    'h': 's6',
    'j': 's7',
    'k': 's8',
    'l': 's9',
}

function Beat(offset, sound) {
    this.offset = offset
    this.sound = sound
}

document.getElementById('metrStartStop').addEventListener('click', onStartStop)
document.getElementById('Play').addEventListener('click', onPlayClick)
document.getElementById('Record').addEventListener('click', onRecordClick)
document.addEventListener('keypress', onKeyPress)

function getSelectedTrack() {
    return document.querySelector('input[name="track"]:checked')
}

function onKeyPress(event) {
    const key = event.key
    console.log(key)

    // logika mapowania key -> sound
    const sound = KeyToSound[key]

    if (sound) {
        if (currentState == State.Recording) {
            let selected = getSelectedTrack()
            if (selected !== null) {
                // record
                let i = parseInt(selected.value) - 1
                let offset = Date.now() - startRecording
                recorder[i].push(new Beat(offset, sound))
            }
        }
        playSound(sound)
    }
}

function onStartStop(event) {
    if (metronom === null) {
        metronom = setInterval(() => {
            playSound('s9')
        }, 60000 / document.getElementById('freq').value)
        event.target.innerText = "Stop"
    }
    else {
        clearInterval(metronom)
        metronom = null
        event.target.innerText = "Start"
    }
}

function onPlayClick(event) {
    if (currentState == State.Stop) {
        let selected = document.querySelectorAll('input[name="play"]:checked')
        if (selected.length == 0) {
            alert('Select tracks first!')
            return
        }

        startPlaying = Date.now()

        selected.forEach(element => {
            console.log('onPlayClick', element.id, element.tagName, element.value)
            let i = parseInt(element.value) - 1
            if (recorder[i].length > 0) {
                let timeout = startPlaying + recorder[i][0].offset - Date.now() // time 
                let n = 0
                console.log(n, timeout)
                setTimeout(() => playCurrentAndSetNext(i, n), timeout)
            }
        });
        event.target.innerText = 'Stop'
        currentState = State.Playing
    }
    else if (currentState == State.Playing) {
        event.target.innerText = 'Play'
        currentState = State.Stop
    }
}

function playCurrentAndSetNext(recNumber, index) {
    let beat = recorder[recNumber][index]
    console.log(beat)
    playSound(beat.sound)
    if (recorder[recNumber].length > index + 1 ) {
        let nextTimeout = startPlaying + recorder[recNumber][index+1].offset - Date.now() // time with correction
        console.log(index, nextTimeout)
        setTimeout(() => playCurrentAndSetNext(recNumber, index+1), nextTimeout)
    }
}

function onRecordClick(event) {
    if (currentState == State.Stop) {
        let selected = getSelectedTrack()
        if (selected === null) {
            alert('Select track first!')
            return
        }
        recorder[selected.value - 1] = []
        recordingTrack = selected
        startRecording = Date.now()
        event.target.innerText = 'Stop'
        currentState = State.Recording
    }
    else if (currentState == State.Recording) {
        event.target.innerText = 'Record'
        currentState = State.Stop
    }
}

function playSound(sound) {
    if (!sound) {
        return
    }
    const audioTag = document.querySelector(`#${sound}`)
    audioTag.currentTime = 0
    audioTag.play()
}

// do usunięcia
function recordSound() {
    let selected = getSelectedTrack()


}
// Date.now()