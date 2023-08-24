const { app, BrowserWindow, ipcMain, Menu, ipcMainEvent } = require('electron')
const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline')
const {PythonShell} = require('python-shell')
const path = require('path')
const shuffleSeed = require('shuffle-seed');
async function puerto(){
  const puertos = await SerialPort.list()
  console.log("PUERTOS", puertos.path)
}
puerto()


let gsr = []
let mazoAG = []
let mazoAP = []
let mazoBG = []
let mazoBP = []
let mazoCG = []
let mazoCP = []
let mazoDG = []
let mazoDP = []
let mezcladoA = []
let mezcladoB = []
let mezcladoC = []
let mezcladoD = []
let bancoini
let configFlag
let tiempo = 0
let selecciones = 0
var mainWindow
let nombres
let configuracion
let user
let password = "pass"
let id
let id_sujeto
let nombre_sujeto
let nombre_config
let idd
let id_aplicador
let id_exp
let flagPru = false
let flagExp = false
let datoI = 0
let modalCont = 0
let inicioPru
let flagPrim = false

//Funcion que crea la ventana de navegador
function createWindow () {
      mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      minWidth: 1280,
      minHeight: 720,
      webPreferences: {
        preload: path.join(__dirname, 'viewscripts/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        devTools: true,
      }
    })
    //mainWindow.loadFile('views/sujetos copy.html')
    mainWindow.loadFile('views/inAr.html')
    mainWindow.menuBarVisible = false
    mainWindow.maximize()
    mainWindow.setAspectRatio(16/9)
    //shuffle(mazoG,mazoP)
    mainWindow.fullScreen = false
    
}



app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    restore()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("modal", async(event)=>{
  if (modalCont == 0){
    modalCont = 1
    mainWindow.webContents.send("nodal", modalCont)
  }
})

async function restore(){
  console.log("HOLAAAAAAAAAAAAAAAAA", modalCont)
  if (modalCont == 0){
    console.log("SÍ ENTRA")
    var options = {
      scriptPath: path.join(__dirname, '/python/'),
      //scriptPath: '/python/',
      // args: ["AAA"],
      mode: 'text',
      pythonOptions: ['-u']
    }
    PythonShell.run('restore.py',options).then(messages=>{
      console.log(messages)
      if (messages[0]!= '0'){
        console.log("ERROR")
        //Funcion para mostrar modal con error, pasar como texto para el modal el parametro messages[1]
        // messages.push(modalCont)
        mainWindow.webContents.send("restore", messages)
      }
      else{
        console.log("AAAAA")
        //Funcion para mostrar modal con exito
        // messages.push(modalCont)
        mainWindow.webContents.send("restore", messages)
      }
    }, reason =>{
      arr = ["1", "Error de Python"]
      mainWindow.webContents.send('restore',reason)
    })
  }
}

//Funciones para la base de datos
const { Pool } = require('pg');
const { config } = require('process');
const { main } = require('@popperjs/core');
const { parse } = require('path');
const { realpath } = require('fs');
const { type } = require('os');

// const credenciales = {
//   user: "igtuser",
//   host: "localhost",
//   database: "igt_db",
//   password: "igtAdmin",
//   port: "5433"
// }

const credenciales = {
  user: "postgres",
  host: "localhost",
  database: "igtManuel",
  password: "admin"
}

const pool = new Pool(credenciales);

//Funcion para sacar la configuracion de la base de datos
async function getSettings(nombre){
  nombre_config = nombre
  const query = await pool.query(`SELECT * FROM configuracion WHERE nombreconf = '${nombre}'`)
  res = query.rows[0]
  mazoAG = res.mazoagan
  mazoAP = res.mazoaper
  mazoBG = res.mazobgan
  mazoBP = res.mazobper
  mazoCG = res.mazocgan
  mazoCP = res.mazocper
  mazoDG = res.mazodgan
  mazoDP = res.mazodper
  tiempo = res.tiempo
  selecciones = res.numsel
  bancoini = res.bancoini
  if (tiempo == null){
    configFlag = "1"
    mezcladoA = shuffle(mazoAG,mazoAP, nombre, configFlag, selecciones)
    mezcladoB = shuffle(mazoBG,mazoBP, nombre, configFlag, selecciones)
    mezcladoC = shuffle(mazoCG,mazoCP, nombre, configFlag, selecciones)
    mezcladoD = shuffle(mazoDG,mazoDP, nombre, configFlag, selecciones)
  }
  else{
    configFlag = "2"
    mezcladoA = shuffle(mazoAG,mazoAP, nombre, configFlag, tiempo)
    mezcladoB = shuffle(mazoBG,mazoBP, nombre, configFlag, tiempo)
    mezcladoC = shuffle(mazoCG,mazoCP, nombre, configFlag, tiempo)
    mezcladoD = shuffle(mazoDG,mazoDP, nombre, configFlag, tiempo)
  }
  configuracion = [nombre, mazoAG, mazoAP,mazoBG, mazoBP,mazoCG, mazoCP,mazoDG, mazoDP,mezcladoA,mezcladoB,mezcladoC,mezcladoD,tiempo,selecciones,bancoini,configFlag] 
  return configuracion
}

//Funcion para sacar el nombre de todas las configuraciones
async function getNameSet(){
  const query = await pool.query('SELECT nombreconf FROM configuracion')
  nombres = query.rows
  return nombres
}


async function getTime(id_exp){
    const query = await pool.query('SELECT tclic FROM resultado  WHERE id_exp = $1 ORDER BY iteracion DESC LIMIT 1', [id_exp]);

    if (query.rows.length == 0){
        anter = 0
    }
    else{
        anterior = query.rows[0].tclic
        anter = anterior
    }
    return anter
}

async function getIte(id_exp){
  const query = await pool.query('SELECT iteracion FROM resultado  WHERE id_exp = $1 ORDER BY iteracion DESC LIMIT 1', [id_exp])
  if (query.rows.length == 0){
    ite = 0
  }
  else{
    ite = query.rows[0].iteracion +1
  }
  return ite
}

async function saveSetDB(configuracion){
  if (configuracion[12]=="1"){
    try{
      const query = await pool.query("insert into configuracion (nombreconf, mazoagan, mazoaper, mazobgan, mazobper, mazocgan, mazocper, mazodgan, mazodper, numsel, tiempo, bancoini) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL, $11)", 
      [configuracion[0], configuracion[1], configuracion[2], configuracion[3], configuracion[4], configuracion[5], configuracion[6], configuracion[7], configuracion[8], configuracion[9], configuracion[11]])
      return query.rows
    }
    catch(e) {
      return [0,e.detail]
    }
  }
  else if (configuracion[12]=="2"){
    try{
    const query = await pool.query("insert into configuracion (nombreconf, mazoagan, mazoaper, mazobgan, mazobper, mazocgan, mazocper, mazodgan, mazodper, numsel, tiempo, bancoini) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, $10, $11)", 
    [configuracion[0], configuracion[1], configuracion[2], configuracion[3], configuracion[4], configuracion[5], configuracion[6], configuracion[7], configuracion[8], configuracion[10], configuracion[11]])
    return query.rows
    }
    catch(e) {
      return [0,e.detail]
    }
  }


}

const setTime = async (id_exp, id_sujeto, ite, seleccion, ganancia, perdida, total, click, voltearCarEnd, intervalo, finR, rean) =>{
    const query = await pool.query('INSERT INTO resultado(id_exp, id_participante, iteracion, seleccion, ganancia, perdida, total, tclic, tretroalimentacion, tintervalo, tinicio, tfinretro) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [id_exp, id_sujeto, ite, seleccion, ganancia, perdida, total, click, voltearCarEnd, intervalo, rean, finR])
  }

async function getAnalisis(){
  const query = await pool.query(`SELECT id_exp,participante.id_participante, nombre ||' '|| apellidos as nombre_completo, fecha,  (CURRENT_DATE - fechanac)/365 as edad, telefono, escolaridad, carrera, case when aptitud = false then 'No' when aptitud = true then 'Si' end as aptitud, case when sexo = false then 'Mujer' when sexo = true then 'Hombre' end as sexo 
  FROM participante, experimento
  WHERE participante.id_participante = experimento.id_participante`)
  return query.rows
}
/*SELECT unnest(iteracion) AS iteracion, 
unnest(click) AS click, 
unnest(retroalimentacion) AS retroalimentacion, 
unnest(intervalo) as intervalo,
unnest(seleccion) as seleccion,
unnest(ganancia) as ganancia,
unnest(perdida) as perdida,
unnest(total) as total
FROM resultado WHERE id_participante = '1'*/
async function getResultados(id){
  const query = await pool.query(`SELECT id_exp, iteracion, seleccion, ganancia,perdida,total,to_char(tclic,'HH24:MI:SS:MS') as tclic,to_char(tretroalimentacion,'HH24:MI:SS:MS') as tretroalimentacion,tintervalo FROM resultado WHERE id_exp = '${id}' ORDER BY iteracion ASC`)
  return query.rows
}

const getSujetosPre = async ()=>{
  const query = await pool.query(`SELECT DISTINCT participante.id_participante, nombre ||' '|| apellidos as nombre_completo,  (CURRENT_DATE - fechanac)/365 as edad, telefono, escolaridad, carrera, case when aptitud = false then 'No' when aptitud = true then 'Si' end as aptitud, case when sexo = false then 'Mujer' when sexo = true then 'Hombre' end as sexo 
  from participante
  WHERE participante.id_participante NOT IN (SELECT id_participante FROM experimento) AND participante.id_participante IN (SELECT id_participante FROM encuesta)`)
  // const query = await pool.query(`SELECT DISTINCT participante.id_participante, nombre ||' '|| apellidos as nombre_completo,  (CURRENT_DATE - fechanac)/365 as edad, telefono, escolaridad, carrera, case when aptitud = false then 'No' when aptitud = true then 'Si' end as aptitud, case when sexo = false then 'Mujer' when sexo = true then 'Hombre' end as sexo 
  // from participante
  // WHERE participante.id_participante NOT IN (SELECT id_participante FROM experimento)`)
  return query.rows
}


const getSujetos = async ()=>{
  const query = await pool.query(`SELECT participante.id_participante, nombre ||' '|| apellidos as nombre_completo,  (CURRENT_DATE - fechanac)/365 as edad, telefono, escolaridad, carrera, 
  case when aptitud = false then 'No' when aptitud = true then 'Si' end as aptitud, 
  case when sexo = false then 'Mujer' when sexo = true then 'Hombre' end as sexo, 
  case WHEN participante.id_participante IN (SELECT id_participante FROM experimento) THEN 'Si' WHEN participante.id_participante NOT IN (SELECT id_participante FROM experimento) THEN 'No' end as expterminado 
  from participante`)
  return query.rows

}

async function getCuestionario(id){
  const query = await pool.query(`SELECT pregunta AS enunciado, respuesta AS respuesta, cita AS numpre FROM encuesta WHERE id_participante = '${id}'`)
  return query.rows
}



async function sendSujeto(id){
  const query = await pool.query(`SELECT id_participante, nombre ||' '|| apellidos as nombre_completo,  (CURRENT_DATE - fechanac)/365 as edad, telefono, escolaridad, carrera, aptitud, case when sexo = false then 'Mujer' when sexo = true then 'Hombre' end as sexo from participante WHERE id_participante = '${id}'`)
  res = query.rows[0]
  id_sujeto = res.id_participante
  nombre_sujeto = res.nombre_completo
  return query.rows
}

async function getLogin(user, password){
  const query = await pool.query(`SELECT id_aplicador from aplicador WHERE usuario = '${user}' AND contraseña = '${password}'`)
  id = query.rows
  id_aplicador = query.rows[0].id_aplicador
  return query.rows
}

async function getProfile(id){
  const query = await pool.query(`SELECT usuario, contraseña, correo FROM aplicador WHERE id_aplicador = ${id}`)
  return query.rows
}

async function saveExp(id_sujeto, id_aplicador, nombre_config){
  try{
      await pool.query(`UPDATE participante SET expterminado = true WHERE id_participante = '${id_sujeto}'`)
  }
  catch(e){
      return [0,e.detail]
  }
  try{
    const ant = await pool.query('SELECT id_exp FROM experimento ORDER BY id_exp DESC LIMIT 1')
    if (ant.rows.length == 0){
      anterior = 0
      id_exp = 0
    }
    else{
      anterior = ant.rows[0].id_exp + 1
      id_exp = ant.rows[0].id_exp + 1
      
    }
  }
  catch(e){
    return[0,e.detail]
  }
  try{
    await pool.query('INSERT INTO experimento(id_exp, id_participante, id_aplicador, nombreconf, fecha) VALUES ($1, $2, $3, $4, NOW())', [anterior, id_sujeto, id_aplicador, nombre_config])
  }
  catch(e){
    return[0,e.detail]
  }
  return[1]
}

async function saveGsr(id_exp, id_sujeto, datos){
  await pool.query('INSERT INTO gsr(id_exp, id_participante, datos) VALUES($1, $2, $3)', [id_exp, id_sujeto, datos])
}

ipcMain.handle('python', async()=>{
  var options = {
    scriptPath: path.join(__dirname, '/python/'),
    //scriptPath: '/python/',
    // args: ["AAA"],
    mode: 'text',
    pythonOptions: ['-u']
  }
  path2 = path.join(__dirname, '/python/backup.py')
  mainWindow.webContents.send('backup', 'HOLA')
  mainWindow.webContents.send('backup', path2)
  // let pyshell = new PythonShell("backup.py", options)
  // pyshell.on('message', function(message){
  //   console.log(message)
  // })
  // pyshell.end(function(err,code,signal){
  //   if (err) throw err
  //   console.log(code)
  //   console.log(signal)
  // })
  PythonShell.run('backup.py',options).then(messages=>{
    console.log(messages)
    if (messages[0]!= '0'){
      console.log("ERROR")
      mainWindow.webContents.send("backup", messages)
      //Funcion para mostrar modal con error, pasar como texto para el modal el parametro messages[1]
    }
    else{
      mainWindow.webContents.send("backup", messages)
      //Funcion para mostrar modal con exito
    }
  }, reason =>{
    arr = ["1", "Error de Python"]
    mainWindow.webContents.send('backup',reason)
  })
  return "Exited"
}
)


ipcMain.on("reset", async (event)=>{
  mazoAG = []
  mazoAP = []
  mazoBG = []
  mazoBP = []
  mazoCG = []
  mazoCP = []
  mazoDG = []
  mazoDP = []
  mezcladoA = []
  mezcladoB = []
  mezcladoC = []
  mezcladoD = []
  bancoini = 0
  configFlag = 0
  tiempo = 0
  selecciones = 0
  id_sujeto = ""
  id_exp = 0
  nombre_sujeto = ""
  nombre_config = ""
})

ipcMain.on("cargarRes", async(event)=>{
  resumen = [mazoAG, mazoAP, mazoBG, mazoBP, mazoCG, mazoCP, mazoDG, mazoDP, bancoini, configFlag, tiempo, selecciones, id_sujeto, nombre_config, nombre_sujeto]
  mainWindow.webContents.send("cargarR", resumen)
  if (serialPort.isOpen === false) {
    serialPort.open();
  }
  if (parser.isPaused() == true){
    parser.resume()
  }
})

ipcMain.on("guardarExp", async(event)=>{
    parser.pause()
    if (parser2.isPaused() == true){
      parser2.resume()
    }
    if (serialPort.isOpen === false) {
      serialPort.open();
    }
    resp = await saveExp(id_sujeto, id_aplicador, nombre_config)
    mainWindow.webContents.send("sendResponse", resp)
})


//Funcion para calcular el intervalo entre los clicks
ipcMain.on("guardarTiempo", async (event, miliSeconds, voltearCarEnd, inter,tiempoIni, seleccion, ganancia, perdida, total, finR, rean)=>{
    click = miliSeconds
    await getTime(id_exp).then(result => anter = result);
    // anter = new Date(anterior)
    await getIte(id_exp).then(result => ite = result)
    if (anter == 0){
      console.log("ANTER")
      intervalo = click - tiempoIni
      inicio = tiempoIni
    }
    else{
      console.log("NO ANTER")
      console.log("CLICK-ANTER", click-anter)
      intervalo = (click - anter) - inter
      inicio = rean
    }
    setTime(id_exp, id_sujeto, ite, seleccion, ganancia, perdida, total, click, voltearCarEnd, intervalo, finR, inicio)
});
//Funcion para enviar los parametros de la configuracion selecccionada
ipcMain.on("enviarConfig", async(event, config)=>{
  if (config == "1"){
    configFlag="1"
    selecciones = 5
    mazoG = [100,150,200,100,75,125,90,130,150,200]
    mazoP = [50,25,100,50,75,200,10,0,25,100]
  }
  else if (config =="2"){
    configFlag="2"
    tiempo= 5000
    mazoG = [100,100,100,100,100,100,100,100,100,100]
    mazoP = [50,50,50,50,50,50,50,50,50,50]
  }
  mezclado = shuffle(mazoG,mazoP)
})

ipcMain.on("cargarIGT", async(event)=>{
  mainWindow.webContents.send("cargarC", configuracion)
})

//Funcion para cargar los nombres de configuraciones en el select
ipcMain.on("cargarNameSettings", async(event)=>{
  if (serialPort.isOpen === true){
    serialPort.close()
  }
  parser.pause()
  await getNameSet();
  mainWindow.webContents.send("cargarNS", nombres)
  
})

ipcMain.on("cargarPuertos", async(event)=>{
  puertos = await SerialPort.list()
  console.log("PUERTOS", puertos)
  mainWindow.webContents.send("cargarP", puertos)
})

//Funcion para cargar los detalles de la configuracion seleccionada
ipcMain.on("loadSetting", async(event, opcion)=>{
  confi = await getSettings(opcion)
  mainWindow.webContents.send("cargarSetting", confi)
})

ipcMain.on("loadPort", async(event, opcion, baud)=>{
  serialPort = new SerialPort({
    path: `\\\\.\\` + opcion,
    baudRate: baud,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: true
  })
  console.log("PUERTO", serialPort.path)
  console.log("PUERTO", serialPort.baudRate)
})

//Funcion para guardar la configuracion en la base de datos
ipcMain.on("saveSet", async(event, configuracion) =>{
  resp = await saveSetDB(configuracion)
  mainWindow.webContents.send("sendResponse", resp)
})

ipcMain.on("sendSujeto", async(event, id)=>{
  suje = await sendSujeto(id)
})

ipcMain.on("getAnalisis", async(event)=>{
  analisis = await getAnalisis()
  mainWindow.webContents.send("cargarAnalisis", analisis)
})

ipcMain.on("getResultados", async(event, id)=>{
  resultado = await getResultados(id)
  mainWindow.webContents.send("cargarResultados", resultado)
})

ipcMain.on("getSujetos", async(event)=>{
  sujetos = await getSujetos()
  mainWindow.webContents.send("cargarSujetos", sujetos)
})
ipcMain.on("getSujetosPre", async(event)=>{
  sujetos = await getSujetosPre()
  mainWindow.webContents.send("cargarSujetos", sujetos)
})

ipcMain.on("getCuestionario", async(event, id)=>{
  cuesti = await getCuestionario(id)
  var cuest = []
  console.log(cuesti[0])
  if(cuesti.length != 0){
    var j = 1
    for (var i in cuesti[0].enunciado){
      var fila = {"numpre": " ", "enunciado": " ", "respuesta": " "}
      if (j >= 22){
        fila.enunciado = cuesti[0].enunciado[i][0]
        fila.numpre = j
        cuesti[0].respuesta[i].pop(0)
        fila.respuesta = cuesti[0].respuesta[i]
      }
      else{
        if (cuesti[0].respuesta[i][0]!='8'){
          if (cuesti[0].respuesta[i][1] == '0'){
            cuesti[0].respuesta[i].splice(1,1, "No")
          }
          else if (cuesti[0].respuesta[i][1]=='1'){
            cuesti[0].respuesta[i].splice(1,1, "Si")
          }
        }

        fila.enunciado = cuesti[0].enunciado[i][0]
        fila.numpre = j
        console.log(cuesti[0].respuesta[i])
        cuesti[0].respuesta[i].splice(0,1)
        console.log(cuesti[0].respuesta[i])
        fila.respuesta = cuesti[0].respuesta[i]
      }
      j ++
      cuest.push(fila)
    }
  }
  mainWindow.webContents.send("cargarCuestionario", cuest)
})

//Funcion para actualizar datos
ipcMain.on("enviarDatosnuevos", async(event, datosnuevos)=>{
  idd = id[0].id_aplicador
  const query = await pool.query(`UPDATE aplicador SET usuario = '${datosnuevos[0]}', contraseña = '${datosnuevos[2]}', correo = '${datosnuevos[1]}' WHERE id_aplicador = ${idd}`);
  user = datosnuevos[0]
  password = datosnuevos[2]
})

//Funcion para enviar las credenciales al hacer el Login
ipcMain.on("enviarCredenciales", async(event, credenciales)=>{
  usuario = credenciales[0]
  contraseña = credenciales[1]
  user = usuario
  password = contraseña
  respuesta = await getLogin(user, password)
  mainWindow.webContents.send("loginCorrecto", respuesta)
})

ipcMain.on("confirmPass", async(event, pass)=>{
  if(pass == password){
    flag = true
    mainWindow.webContents.send("resultPass", flag)    
  }
  else{
    flag = false
    mainWindow.webContents.send("resultPass", flag)
  }
})

ipcMain.on("cargarPro", async(event)=>{
  resp = await getProfile(id[0].id_aplicador)
  mainWindow.webContents.send("getPro", resp)
})



//Funcion para mezclar el mazo
function shuffle2(mazoG, mazoP, nombre, configFlag, dato){
  //return consulta.rows[0].ganancia
  //console.log("Indice: ", mazoG)
  //console.log("Indice Per: ", mazoP)
  const merge = (first, second, third) => {
      for(let i=0; i<second.length; i++) {
        let pares = [];
        pares.push(first[i]);
        pares.push(second[i]);
        third.push(pares);
      }
      return third;
    }
  let obj = [];
  resultadoPares = merge(mazoG, mazoP, obj)
  console.log("Resultado pares", resultadoPares);
  const repeat = (arr, n) => [].concat(...Array(n).fill(arr));
  if (configFlag == '1'){
    n = dato/10
  }
  else if(configFlag == '2'){
    n = Math.ceil(dato/3)
  }
  copia = repeat(resultadoPares, n)
  console.log("Repeat", copia);
  //console.log("Arreglo original: ", copia)
  var resp = shuffleSeed.shuffle(copia,nombre);
  for(var i = 0; i < resp.length; i++){
    console.log(i)
    console.log("resp", resp[i]);
   }
  //console.log("Arreglo mezclado: ", resp);
  //console.log("INDICE", resp[0][0])

  return resp
}

function shuffle(mazoG, mazoP, nombre, configFlag, dato){
  //return consulta.rows[0].ganancia
  //console.log("Indice: ", mazoG)
  //console.log("Indice Per: ", mazoP)
  var resp = []
  const merge = (first, second, third) => {
      for(let i=0; i<second.length; i++) {
        let pares = [];
        pares.push(first[i]);
        pares.push(second[i]);
        third.push(pares);
      }
      return third;
    }
  let obj = [];
  resultadoPares = merge(mazoG, mazoP, obj)
  if (configFlag == '1'){
    n = dato/10
  }
  else if(configFlag == '2'){
    n = Math.ceil(dato/3)
  }
  for(var i = 0; i< n; i++){
    ad = i.toString()
    nombre2 = nombre+ad
    var shuf = shuffleSeed.shuffle(resultadoPares,nombre2)
    resp = resp.concat(shuf)
  }
  // for(var i = 0; i < resp.length; i++){
  //   console.log(i)
  //   console.log("resp", resp[i]);
  //  }
  // console.table("Arreglo mezclado: ", resp);
  console.dir(resp, {'maxArrayLength': null})

  return resp
}

const port = 'COM3';

let serialPort = new SerialPort({
  // path: 'COM3',
  path: `${port}`,
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  autoOpen: true
  });
readl = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
readl2 = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
let parser = readl
let parser2 = readl2 
// parser2.on('data', (chunk) => {
//   if (flagExp == true){
//     datoI+=1
//     //console.log(chunk)
//     if (datoI==1){
//     }
//     else{
//       chunk = parseInt(chunk)
//     if (chunk >= 0 && chunk <=1023){
//       obj = {
//         tipo: "valor",
//         gsr: chunk, 
//         tiempo: new Date()
//       }
//       gsr.push(obj)
//     }
//     }
//   }
  
// })
// parser2.pause()
//Obtener datos del GSR
// ipcMain.on('gsrIgt', async (event)=>{
//   i=0
//   readl.pause()
//   //parser2.resume()
//   if (serialPort.isOpen === false) {
//     serialPort.open();
//   }
//   obj = {
//     tipo: "inicio",
//     gsr: 1, 
//     tiempo: new Date()
//   }
//   gsr.push(obj)
//   serialPort.write('1')
//   flagExp = true
//   // parser2.on('data', (chunk) => {
//   //   i+=1
//   //   console.log(chunk)
//   //   if (i==1){
//   //     console.log("SALTO")
//   //   }
//   //   else{
//   //     chunk = parseInt(chunk)
//   //    if (chunk >= 0 && chunk <=1023){
//   //     obj = {
//   //       tipo: "valor",
//   //       gsr: chunk, 
//   //       tiempo: new Date()
//   //     }
//   //     gsr.push(obj)
//   //   }
//   //   }
    
//   // })
// })

ipcMain.on('gsrInicioPrueba', async (event)=>{
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  inicioPru = time
  obj = {
    tipo: "inicioPrueba",
    gsr: 1, 
    tiempo: time
    //tiempo: new Date() //HH24:MM:SS:MS
  }
  gsr.push(obj)
  serialPort.write('1')
})

ipcMain.on('gsrInicio', async (event)=>{
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  // if (flagPrim == false){
  //   flagPrim = true
  //   time = inicioPru
  // }
  obj = {
    tipo: "inicio",
    gsr: 1, 
    tiempo: time
    //tiempo: new Date() //HH24:MM:SS:MS
  }
  gsr.push(obj)
  //serialPort.write('1')
})

ipcMain.on('gsrCrear', async(event)=>{
  console.time("crear")
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  obj = {
    tipo: "clic",
    gsr: 1, 
    tiempo: time
    //tiempo : new Date()
  }
  gsr.push(obj)
  console.time("ARDUINO")
  serialPort.write('1')
  console.timeEnd("ARDUINO")
  console.timeEnd("crear")
})
ipcMain.on('gsrRetro', async(event)=>{
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  console.log(typeof(time), ": ", time)
  obj = {
    tipo: "retro",
    gsr: 1, 
    tiempo: time
    //tiempo : new Date()
  }
  gsr.push(obj)
  //serialPort.write('1')
})

ipcMain.on('gsrFinRetro', async(event)=>{
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  console.log(typeof(time), ": ", time)
  obj = {
    tipo: "finretro",
    gsr: 1, 
    tiempo: time
    //tiempo : new Date()
  }
  gsr.push(obj)
  //serialPort.write('1')
})

ipcMain.on('finIgt', async(event)=>{
  let tiempo = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Mexico_City', timeZoneName:'longOffset',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3}))
  let time = (tiempo.getHours()) + ":" + (tiempo.getMinutes()) + ":" + (tiempo.getSeconds()) + "." + (tiempo.getMilliseconds());
  obj = {
    tipo: "fin",
    gsr: 1, 
    tiempo: time
    //tiempo : new Date()
  }
  gsr.push(obj)
  serialPort.write('1')
  if (serialPort.isOpen === true) {
    serialPort.close();
  }
  flagExp = false
  flagPrim = false

  //console.log(JSON.stringify(gsr))
  obj2 = {
    resultado:gsr
  }
  await saveGsr(id_exp, id_sujeto, JSON.stringify(obj2))
  gsr = []
})

ipcMain.on('encender', async(event)=>{
  if (serialPort.isOpen === false) {
    serialPort.open();
  }
  serialPort.write('1')
})

ipcMain.on('apagar', async(event)=>{
  if (serialPort.isOpen === false) {
    serialPort.open();
  }
  serialPort.write('0')
}) 

parser.on('data', (chunk) => {
  if (flagPru == true){
    mainWindow.webContents.send('senso', chunk);
  }
  //console.log('SIGOOO');
  // len+=1;
  // arrValues.push(parseInt(chunk));
  // if (len === 10) {
  //   let sum2 = 0;
  //   arrValues.map((x) => sum2 += x);
  //   gsrAverage = sum2 / 10;
  //   console.log('GSR AVErage', gsrAverage);
  //   hr = ((1024 + 2 * gsrAverage) * 1000) / (512 - gsrAverage);
  //   console.log('GSR', hr);
  //   len = 0;
  //   arrValues.length = 0;
  //   mainWindow?.webContents.send('senso', hr);
  // }
  // for (let i = 0; i < 10; i++) {
  //   buffer = '';
  //   buffer += chunk;
  //   console.log(buffer);
  //   sum += parseInt(buffer);
  // }
  // gsrAverage = sum / 10;
  // sum = 0;
  // console.log('Gsr Average', gsrAverage);
  // hr = ((1024 + 2 * gsrAverage) * 1000) / (512 - gsrAverage);
  // console.log('GSR', hr);
  // const resp = await sleep(10000);
  // console.log("Resp", resp);
    //console.log('c', chunk);
    //console.log(typeof chunk)
    //console.log(JSON.stringify(chunk))
    // try{
    //   event.reply('senso', chunk);
    // }
    // catch(err){
    //   console.log(err)
    // }
});
parser.pause()
ipcMain.on('sensores',  async (event) => {
  parser._readableState.buffer.clear()
  parser._readableState.length = 0
  //readl2.pause()
  //parser.resume()
  flagPru = true
  // const resp = await sensores();
  // console.log(resp);
  i= 0
  const buffer = '';
  const sum = 0;
  const gsrAverage = 0;
  const hr = 0;
  const len = 0;
  const arrValues = [];
  // parser.on('data', (chunk) => {
  //   i+=1
  //   //console.log('SIGOOO');
  //   // len+=1;
  //   // arrValues.push(parseInt(chunk));
  //   // if (len === 10) {
  //   //   let sum2 = 0;
  //   //   arrValues.map((x) => sum2 += x);
  //   //   gsrAverage = sum2 / 10;
  //   //   console.log('GSR AVErage', gsrAverage);
  //   //   hr = ((1024 + 2 * gsrAverage) * 1000) / (512 - gsrAverage);
  //   //   console.log('GSR', hr);
  //   //   len = 0;
  //   //   arrValues.length = 0;
  //   //   mainWindow?.webContents.send('senso', hr);
  //   // }
  //   // for (let i = 0; i < 10; i++) {
  //   //   buffer = '';
  //   //   buffer += chunk;
  //   //   console.log(buffer);
  //   //   sum += parseInt(buffer);
  //   // }
  //   // gsrAverage = sum / 10;
  //   // sum = 0;
  //   // console.log('Gsr Average', gsrAverage);
  //   // hr = ((1024 + 2 * gsrAverage) * 1000) / (512 - gsrAverage);
  //   // console.log('GSR', hr);
  //   // const resp = await sleep(10000);
  //   // console.log("Resp", resp);
  //     //console.log('c', chunk);
  //     //console.log(typeof chunk)
  //     //console.log(JSON.stringify(chunk))
  //     console.log(chunk)
  //     try{
  //       event.reply('senso', chunk);
  //     }
  //     catch(err){
  //       console.log(err)
  //     }
  //   // mainWindow?.webContents.send('senso', chunk);
  // });
});

async function sensoresStop() {
  //parser.off('data', console.log);
  if (serialPort.isOpen === true) {
    serialPort.close();
    flagPru = false
    parser.pause()
    parser2.pause()
    parser._readableState.buffer.clear()
    parser._readableState.length = 0
    parser2._readableState.buffer.clear()
    parser2._readableState.length = 0
    //parser.removeListener('data', )
    //serialPort.reset()
  }
  // parser.write('\x03')
}

ipcMain.on('sensoresStop', async (event) => {
  const resp = await sensoresStop();
  mainWindow.webContents.send('sensoStop', resp);
});

