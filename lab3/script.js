const indicator = document.querySelector('#indicator');
const bpmInput = document.querySelector("#bpmInput");

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
    const playedChannel = recordingChannels[channel];

    for (let i = 0; i < playedChannel.length; i++) {
        const record = playedChannel[i];
        await new Promise((resolve) => setTimeout(() => {
            playSound(record.sound);
            resolve();
        }, record.delay));
    }
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

document.addEventListener('keypress', onKeyPress);
