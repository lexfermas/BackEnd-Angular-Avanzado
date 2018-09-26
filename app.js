//Es el punto de entrada para la aplicación
//se escribe todo el código que va a inicializar el servidor express.


//Requires: es una importación de librerias, para que el proyecto funcione.

let express = require('express');
let mongoose = require('mongoose');


//inicializar variables: es donde se inician las librerias

var app = express();

//conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if(err) throw err;

    console.log("Data base exit: \x1b[32monline\x1b[0m");
});


//rutas
app.get('/', (req, res, next) =>{

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente puerto 200'
    })
});

//escuchar peticiones.
app.listen(3000, ()=>{
    console.log("Espress serve puerto 3000: \x1b[32monline\x1b[0m");
});