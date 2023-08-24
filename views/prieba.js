window.Bridge.cargarSujetos((event, sujetos) => {
    $('#example').DataTable({
        "data": sujetos,
        "columns": [
            {"data": "id_participante"},
            {"data": "nombre"},
            {"data": "apellidos"},
            {"data": "fechanac"},
            {"data": "telefono"},
            {"data": "escolaridad"},
            {"data": "carrera"},
            {"data": "correo"},
            {"data": "contraseña"},
            {"data": "neurotipicidad"}
        ]
    });
})

$(document).ready(async function () {
    await window.Bridge.getSujetos();
});