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

interval(DataHandler.saveData, DataHandler.logData);

function interval(saveCallback, logCallback) {
  let timer = 1;
  setInterval(() => {
    saveCToSessionStorage(timer, saveCallback);
    timer++;
  }, 2000);
}

function saveCToSessionStorage(data, saveCallback) {
  saveCallback(data);
}

function discoverPowerBallNumber(data) {
  const number = Math.floor(Math.random() * data * 100);
  console.log('[powerball number]', number);
}
