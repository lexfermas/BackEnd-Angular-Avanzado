var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//permite usar todas las funciones y metodos que tiene el hospitalSchema.
var hospitalModels = require('../models/hospital');

// ==================================================
//                  Listar Hospitales
// ==================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //si viene un parametro "desde" usa el req.query.desde sino usa 0.
    desde = Number(desde);

    //Query para listar los hopitales 
    hospitalModels.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') //es una funcion de mongoose para filtrar los nombre de columnas que se quieren mostrar
        .exec(
            (err, todosHospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar Hospitales',
                        errors: err,
                    });
                }

                hospitalModels.count({}, (err, contador) =>{
                    
                    res.status(200).json({
                        ok: true,
                        todosHospitales,
                        total: contador
                    });
                })
            });
});

// ================================
// Actualizar un hospital
// ================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    hospitalModels.findById(id, (err, hospitalid) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error, hospital no encontrdo',
                errors: err,
            });
        }

        if (!hospitalid) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'no exixste el hospital' },
                });
            }
        }

        hospitalid.nombre = body.nombre;
        hospitalid.usuario = req.usuario._id; //ojo

        hospitalid.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospitalActualizado: hospitalActualizado
            });
        });
    });
});

// ================================
// Crear un nuevo hospita mdAutenticacion.verificaToken,
// ================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; //rq.body biene de la libreria body-parser.
    var _hospital = new hospitalModels({
        nombre: body.nombre,
        usuario: req.usuario._id, //es el id de un usuario ya creado y existente en la BD. (NO Es necesario colocar el id del usuario al crear el hospital)
    });

    _hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar hospital',
                errors: err,
            });
        }

        res.status(201).json({
            ok: true,
            HOSPITAL: hospitalGuardado,
        });
    });
});

// ================================
// Borrar un hospital por el ID
// ================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    hospitalModels.findByIdAndRemove(id, (err, hospitalBorrar) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrar) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no existe un hospital con el id: ' + id,
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hopitalBorrar: hospitalBorrar
        });
    });
});


module.exports = app;
