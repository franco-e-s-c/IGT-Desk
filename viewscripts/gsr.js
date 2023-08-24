//import { plot } from '../node_modules/plotly.js-dist/plotly.js';
data = 0

async function loadSensores() {
  window.Bridge.cargarPuertos()
    /*plot.plot('chart',[{
        y:[0],
        type:'line'
    }])*/
    TESTER = document.getElementById('chart');
        Plotly.newPlot( TESTER, [{
        y: [0] }], {
        margin: { t: 0 } } );
    window.Bridge.sensores()
  }

window.Bridge.cargarP((event, puertos) => {
    nombresSet = puertos
    respaldo = document.getElementById("savePorts").innerHTML
    codigo = respaldo
    for (var i = 0; i<nombresSet.length; i++){
        codigo += `<option value="${nombresSet[i].path}">${nombresSet[i].path}</option>` 
    }
    document.getElementById("savePorts").innerHTML = codigo
})
window.Bridge.senso((event, resp) => {
    data = resp
    // let buffer = '';
    // let sum = 0;
    // let gsrAverage = 0;
    // let hr = 0;
    // for (let i = 0; i < 10; i++) {
    //   buffer = '';
    //   buffer += resp;
    //   console.log(buffer);
    //   sum += parseInt(buffer);
    // }
    // gsrAverage = sum / 10;
    // console.log('Gsr Average', gsrAverage);
    // hr = ((1024 + 2 * gsrAverage) * 1000) / (512 - gsrAverage);
    // console.log('GSR', hr);
  });

function loadPor(){
  porV = document.getElementById("savePorts")
  bauV = document.getElementById("baud")
  //console.log("BUAD", typeof bauV.value)
  opcion = porV.value
  baud = parseInt(bauV.value)
  if(opcion == '0'){

  }
  else{
    window.Bridge.loadPort(opcion, baud)
  }
}

var interval = setInterval(function(){
  Plotly.extendTraces(TESTER, {y:[[data]]}, [0])
}, 300)

async function stopSensores() {
  window.Bridge.sensoresStop();
}

async function encender(){
  window.Bridge.encender()
  Plotly.extendTraces(TESTER, {y:[['1']]}, [0])
}

async function apagar(){
  window.Bridge.apagar()
  Plotly.extendTraces(TESTER, {y:[['0']]}, [0])
}

async function cerrar(){
  window.Bridge.sensoresStop()
}

window.Bridge.sensoStop((event, resp) => {
});
