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
    saveCToSessionStorage(timer, saveCallback, logCallback);
    timer++;
  }, 2000);
}

function saveCToSessionStorage(data, saveCallback, logCallback) {
  saveCallback(data);
  logCallback(`[log from C] ${data}`);
}
