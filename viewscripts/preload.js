const { contextBridge, ipcMain, ipcRenderer } = require('electron')

function enviarTiempo(miliSeconds, voltearCarEnd, inter, tiempoIni, seleccion, ganancia, perdida, total, finR, rean){
  ipcRenderer.send("guardarTiempo", miliSeconds, voltearCarEnd, inter, tiempoIni, seleccion, ganancia, perdida, total, finR, rean);
}

function enviarConfig(config){
  ipcRenderer.send("enviarConfig", config)
}

function enviarSeñal(){
  ipcRenderer.send("modal")
}

function cargarIGT(){
  ipcRenderer.send("cargarIGT")
}

function cargarNameSettings(){
  ipcRenderer.send("cargarNameSettings")
}
function cargarPuertos(){
  ipcRenderer.send("cargarPuertos")
}

function loadSetting(opcion){
  ipcRenderer.send("loadSetting", opcion)
}

function loadPort(opcion,baud){
  ipcRenderer.send("loadPort", opcion,baud)
}

function saveSet(configuracion){
  resp = ipcRenderer.send("saveSet", configuracion)
}

function getAnalisis(){
  ipcRenderer.send("getAnalisis")
}

function getResultados(id){
  ipcRenderer.send("getResultados", id)
}

function getSujetos(){
  ipcRenderer.send("getSujetos")
}

function getSujetosPre(){
  ipcRenderer.send("getSujetosPre")
}

function getCuestionario(id){
  ipcRenderer.send("getCuestionario", id)
}

function sendSujeto(id){
  ipcRenderer.send("sendSujeto", id)
}

function enviarDatosnuevos(datosnuevos){
  ipcRenderer.send("enviarDatosnuevos", datosnuevos)
}

function enviarCredenciales(id){
  //console.log("enviarusuario")
  ipcRenderer.send("enviarCredenciales", id)
}

function confirmPass(pass){
  ipcRenderer.send("confirmPass", pass)
}

function cargarPro(){
  ipcRenderer.send("cargarPro")
}

function reset(){
  ipcRenderer.send("reset")
}

function cargarRes(){
  ipcRenderer.send("cargarRes")
}

function guardarExp(){
  ipcRenderer.send("guardarExp")
}

function python(){
  ipcRenderer.invoke("python")
}


let indexBridge = {
  enviarTiempo: enviarTiempo,
  enviarConfig: enviarConfig,
  cargarIGT: cargarIGT,
  cargarC: (callback) => ipcRenderer.on("cargarC", (callback)),
  cargarNameSettings: cargarNameSettings,
  cargarNS: (callback) => ipcRenderer.on("cargarNS", (callback)),
  cargarPuertos: cargarPuertos,
  cargarP: (callback) => ipcRenderer.on("cargarP", (callback)),
  loadSetting: loadSetting,
  loadPort: loadPort,
  cargarSetting: (callback) => ipcRenderer.on("cargarSetting", (callback)),
  saveSet: saveSet,
  getAnalisis: getAnalisis,
  cargarAnalisis: (callback) => ipcRenderer.on("cargarAnalisis", (callback)),
  getResultados: getResultados,
  cargarResultados: (callback) => ipcRenderer.on("cargarResultados", (callback)),
  getSujetos: getSujetos,
  getSujetosPre: getSujetosPre,
  cargarSujetos: (callback) => ipcRenderer.on("cargarSujetos", (callback)),
  getCuestionario: getCuestionario,
  sendSujeto: sendSujeto,
  reset:reset,
  cargarCuestionario: (callback) => ipcRenderer.on("cargarCuestionario", (callback)),
  enviarCredenciales: enviarCredenciales,
  loginCorrecto: (callback) => ipcRenderer.on("loginCorrecto", (callback)),
  confirmPass: confirmPass,
  resultPass: (callback) => ipcRenderer.on("resultPass", (callback)),
  cargarPro: cargarPro,
  getPro: (callback) => ipcRenderer.on("getPro", (callback)),
  enviarDatosnuevos: enviarDatosnuevos,
  cargarRes: cargarRes,
  cargarR: (callback) => ipcRenderer.on("cargarR", (callback)),
  sendResponse: (callback) => ipcRenderer.on("sendResponse", (callback)),
  backup: (callback) => ipcRenderer.on("backup", (callback)),
  restore: (callback) => ipcRenderer.on("restore", (callback)),
  nodal: (callback) => ipcRenderer.on("nodal", (callback)),
  enviarSeñal: enviarSeñal,
  guardarExp: guardarExp,
  sensores() {
    ipcRenderer.send('sensores');
  },
  encender(){
    ipcRenderer.send('encender');
  },
  apagar(){
    ipcRenderer.send('apagar');
  },
  gsrIgt(){
    ipcRenderer.send('gsrIgt');
  },
  gsrInicioPrueba(){
    ipcRenderer.send('gsrInicioPrueba')
  },
  gsrInicio(){
    ipcRenderer.send('gsrInicio')
  },
  finIgt(){
    ipcRenderer.send('finIgt');
  },
  sensoresStop() {
    ipcRenderer.send('sensoresStop');
  },
  gsrCrear(){
    ipcRenderer.send('gsrCrear')
  },
  gsrRetro(){
    ipcRenderer.send('gsrRetro')
  },
  gsrFinRetro(){
    ipcRenderer.send('gsrFinRetro')
  },
  senso: (callback) => ipcRenderer.on('senso', callback),
  sensoStop: (callback) => ipcRenderer.on('sensoStop', callback),
  python(){
    ipcRenderer.invoke('python')
  }
}

contextBridge.exposeInMainWorld("Bridge", indexBridge);

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

