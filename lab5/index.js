class DataHandler {
  static saveData(data) {
    console.log('[reader C]', data);
    const storageData = { data };
    sessionStorage.setItem('C', JSON.stringify(storageData));
  }

  static logData(data) {
    console.log('[log from C]', data);
  }
}

function interval(saveCallback, logCallback, discoverCallback) {
  let timer = 1;
  setInterval(() => {
    const data = discoverCallback(timer);
    saveCallback(data);
    logCallback(data);
    timer++;
  }, 1000);
}

function saveCToSessionStorage(data, logCallback) {
  console.log('[reader C]', data);
  const storageData = { data };
  sessionStorage.setItem('C', JSON.stringify(storageData));
  logCallback(`[log from C] ${data}`);
}

function discoverPowerBallNumber(data) {
  const number = Math.floor(Math.random() * data * 100);
  console.log('[powerball number]', number);
  return number;
}

interval(DataHandler.saveData, DataHandler.logData, discoverPowerBallNumber);
