//conecta la coleccion Usuarios creada en la base de datos hospitalDB

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique:true, required: [true, 'El correo es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesario']},
    img: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},

});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} debe de ser único'});

//exporta este esquema fuera de este archivo
module.exports = mongoose.model('usuarios',usuarioSchema); //'usuarios' es el q se almacena en la base de datos
//si la coleccion no tiene el mismo nombre, crea una coleccion nueva con el nombre que se coloque aqui.