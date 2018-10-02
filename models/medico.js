var mongoose = require('mongoose');
var Schemas = mongoose.Schema;

var medicoSchema = new Schemas({
    nombre: {type: String, required:[true, 'El nombre es requerido']},
    img: {type: String, required: false},
    usuario:{type: Schemas.Types.ObjectId, ref: 'usuarios',required: true},
    hospital:{type: Schemas.Types.ObjectId, 
            ref: 'Hospital',
            required: [true,'El id hospital es un campo hobligatorio']}
});

module.exports = mongoose.model('medicos',medicoSchema);