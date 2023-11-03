const indicator = document.querySelector('#indicator');
const bpmInput = document.querySelector("#bpmInput");
const channelsContainer = document.querySelector("#channelsContainer");
let lastChannelNmb = 4;
let isLooped = false;
const channelFixedLength=15;

const KeyToSound = {
    'a': document.querySelector('#s1'),
    's': document.querySelector('#s2'),
    'd': document.querySelector('#s3'),
    'f': document.querySelector('#s4'),
}

const recordingChannels = {
    channel1: [],
    channel2: [],
    channel3: [],
    channel4: [],
}

let activeChannel;

function onKeyPress(event) {
    const sound = KeyToSound[event.key];
    if (sound) {
        playSound(sound);
        recordSound(sound, activeChannel);
    }
    console.log(sound);
    const activeChannelContent = recordingChannels[activeChannel];
    console.log(`Zawartość kanału ${activeChannel}:`, activeChannelContent);
}

function setActiveChannel(channel) {
    activeChannel = channel;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function recordSound(sound, channel) {
    let channelRetrieved = recordingChannels[channel];
    if (channelRetrieved) {
        const currentTime = Date.now();
        if (channelRetrieved.length > 0) {
            const delay = currentTime - (channelRetrieved[channelRetrieved.length - 1].timestamp);
            recordingChannels[channel].push({ sound, delay, timestamp: currentTime });
        } else {
            recordingChannels[channel].push({ sound, delay: 0, timestamp: currentTime });
        }
    }
}


function startRecording(channel) {
    recordingChannels[channel] = [];
    setActiveChannel(channel);
}

function stopRecording(channel) {
    recordingChannels[channel] = recordingChannels[channel] || [];
}

async function playChannel(channel) {
    let loopCheckbox = document.getElementById("loopCheckbox");

    let playedChannel = recordingChannels[channel];

    if (loopCheckbox.checked == true) {
        if (playedChannel.length < channelFixedLength) {
            let currentIndex = 0;

            while (playedChannel.length < channelFixedLength) {
                const dataToCopy = playedChannel[currentIndex % playedChannel.length];
                playedChannel.push(dataToCopy);
                currentIndex++;
            }
        } else {
            playedChannel = playedChannel.slice(0, channelFixedLength);
            recordingChannels[channel] = playedChannel;
        }
    }

    for (let i = 0; i < playedChannel.length; i++) {
        const record = playedChannel[i];
        await new Promise((resolve) => setTimeout(() => {
            playSound(record.sound);
            resolve();
        }, record.delay));
    }

    console.log(playedChannel);
}

function playAllChannels() {
    for (let channel in recordingChannels) {
        playChannel(channel);
    }
}

function playSelectedChannels(){
    let checkedRadios = document.querySelectorAll('input[type=radio]:checked');
    for (let radio of checkedRadios) {
        let id = radio.id;
        let channel = id.slice(0, -5);
        playChannel(channel);
    }
}

let metronomeInterval;

async function playMetronome(){
    let bpmValue = parseFloat(bpmInput.value);

    if (isNaN(bpmValue) || bpmValue <= 0){
        alert('set the BPM (must be positive number)');
        return;
    }

    const intervalMs = 60000 / bpmValue;

    metronomeInterval = setInterval(() => {
        indicator.classList.toggle("colorful");
    }, intervalMs);
}

function stopMetronome() {
    clearInterval(metronomeInterval);
}

function addChannel() {
    ++lastChannelNmb;
    const fragment = document.createDocumentFragment();
    const lineBreak = document.createElement('br');
    const startBtn = document.createElement('button');
    const stopBtn = document.createElement('button');
    const playBtn = document.createElement('button');
    const inputRadio = document.createElement("INPUT");
    inputRadio.setAttribute("type", "radio");

    startBtn.addEventListener("click", function() {
        startRecording('channel' + lastChannelNmb);
    });
    startBtn.textContent = "Start Recording Channel " + lastChannelNmb;
    startBtn.setAttribute("id", "btnStart" + lastChannelNmb);
    
    stopBtn.addEventListener("click", function() {
        stopRecording('channel' + lastChannelNmb);
    });
    stopBtn.textContent = "Stop Recording Channel " + lastChannelNmb;
    stopBtn.setAttribute("id", "btnStop" + lastChannelNmb);
    
    playBtn.addEventListener("click", function() {
        playChannel('channel' + lastChannelNmb);
    });
    playBtn.textContent = "Play Channel " + lastChannelNmb;
    playBtn.setAttribute("id", "btnPlay" + lastChannelNmb);
    
    inputRadio.setAttribute("id", "channel" + lastChannelNmb + "Radio");

    fragment.append(lineBreak);
    fragment.appendChild(startBtn);
    fragment.appendChild(stopBtn);
    fragment.appendChild(playBtn);
    fragment.appendChild(inputRadio);

    channelsContainer.appendChild(fragment);
}

function removeChannel(){
    const startBtn = document.getElementById('btnStart'+lastChannelNmb);
    const stopBtn = document.getElementById('btnStop'+lastChannelNmb);
    const playBtn = document.getElementById('btnPlay'+lastChannelNmb);
    const inputRadio = document.getElementById('channel'+lastChannelNmb+'Radio');

    startBtn.remove();
    stopBtn.remove();
    playBtn.remove();
    inputRadio.remove();

    --lastChannelNmb;
}

document.addEventListener('keypress', onKeyPress);
