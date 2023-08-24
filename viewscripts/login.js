let modalContLogin = 0;
function seleccionarLogin(){
    user = document.getElementById("inputUser").value
    password = document.getElementById("inputPassword").value
    let credenciales = []
    credenciales.push(user)
    credenciales.push(password)
    window.Bridge.enviarCredenciales(credenciales);
    
}


window.Bridge.loginCorrecto((event, respuesta)=>{
    if (respuesta.length == 0){
        window.location.href = "../views/login.html";
        console.log("Bebecita")
    }
    else {
        window.location.href = "../views/perfil.html";
        console.log("Bebecita corr")
    }
})

$(document).ready(function(){
    console.log("PESMFWIOPEMNFPO")
    window.Bridge.enviarSeñal();
})

window.Bridge.nodal((event, modalCont)=>{
    modalContLogin = modalCont
    console.log("ModalCont", modalContLogin)
    if (modalContLogin == 1){
        console.log("OSINFOIWEN")
        $("#staticBackdrop").modal('show');
    }
    else {
        $("#staticBackdrop").modal('hide');
    }
})

window.Bridge.restore((event, messages) =>{
    //console.log(messages)
    // modalContLogin = messages[messages.length -1]
    // console.log("ModalCont", modalContLogin)
    if (messages[0] == '0'){
        //console.log("pg_dump: error: fall la conexin a la base de datos igt_db: no se pudo conectar con el servidor: Connection refused (0x0000274D/10061)\r")
        //console.log("Messages: ", messages[1])
        let messagesE = messages[1].slice(0, 14)
        //console.log("MessagesS", messagesE)
        if (messagesE == "pg_dump: error"){
            document.getElementById('texto').style.textAlign = "left"
            document.getElementById('carga').src=''
            var mensaje = messages[1]
            document.getElementById("staticBackdropLabel").innerHTML = "Error"
            document.getElementById("boton").disabled = false
            document.getElementById("texto").innerHTML = "Ocurrió un error con la conexión a la base de datos, intenta verificar si el túnel fue establecido correctamente y vuelve a ejecutar el programa."
        }
        else{
            document.getElementById('texto').style.textAlign = "left"
            document.getElementById('carga').src=''
            document.getElementById("staticBackdropLabel").innerHTML = "Restore exitoso"
            document.getElementById("texto").innerHTML = 'Sin error'
            document.getElementById("boton").disabled = false
        }
    }
    else{
        document.getElementById('texto').style.textAlign = "left"
        document.getElementById('carga').src=''
        var mensaje = messages[1]
        document.getElementById("staticBackdropLabel").innerHTML = "Error"
        document.getElementById("boton").disabled = false
        document.getElementById("texto").innerHTML = mensaje
    }
});