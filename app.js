//Es el punto de entrada para la aplicación
//se escribe todo el código que va a inicializar el servidor express.


//Requires: es una importación de librerias, para que el proyecto funcione.

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');


//inicializar variables: es donde se inician las librerias

var app = express();

//body-parser inicializacion
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if(err) throw err;

    console.log("Data base connection: \x1b[32monline\x1b[0m");
});


//rutas (definimos un middleware) se ejecuta antes de que se ejecuten otras rutas
app.use('/usuario', usuarioRoutes); //'usuario tiene que ser igual al de la DB'
app.use('/hospital', hospitalRoutes); //'hospital tiene que ser igual al de la DB, si la coleccion no existe esta se crea automaticamente'
app.use('/medico', medicoRoutes); //'hospital tiene que ser igual al de la DB, si la coleccion no existe esta se crea automaticamente'
app.use('/login', loginRoutes); 
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);

//escuchar peticiones.
app.listen(3000, ()=>{
    console.log("Espress serve puerto 3000: \x1b[32monline\x1b[0m");
});