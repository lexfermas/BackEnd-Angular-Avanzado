var mongoose = require('mongoose');

var Schema = mongoose.Schema;

hospitalSchema = new Schema({
    nombre: {type: String, required:[true,'El nombre es necesario']},
    img: {type: String, required: false},
    usuario: {type:Schema.Types.ObjectId, ref:'usuarios'}
}, {collection:'hospitales'}); //este es el nombre que tendra la coleccion en la base de datos. sino se gusrdará como hospitals

module.exports = mongoose.model('Hospital',hospitalSchema);
