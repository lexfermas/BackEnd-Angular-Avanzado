var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//permite usar todas las funciones y metodos que tiene el hospitalSchema.
var medicoModels = require('../models/medico');

// ==================================================
//                  Listar medico
// ==================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    //Query para listar los hopitales 
    medicoModels.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') //es una funcion de mongoose para filtrar los nombre de columnas que se quieren mostrar
        .populate('Hospital')
        .exec(
            (err, todosmedicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar médicos',
                        errors: err,
                    });
                }
                medicoModels.count({}, (err, contador)=>{

                    res.status(200).json({
                        ok: true,
                        todosmedicos,
                        total: contador
                    });
                })
            });
});

// ================================
// Actualizar un medico
// ================================

app.put('/:id',mdAutenticacion.verificaToken, (req, res) =>{

    var id = req.params.id;
    var body = req.body;

    medicoModels.findById(id, (err, medicoid) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error, medico no encontrdo',
                errors: err,
            });
        }

        if(!medicoid){
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',
                    errors: {message: 'no exixste el medico'},
                });
            }
        }

        medicoid.nombre = body.nombre;
        medicoid.usuario = req.usuario._id; //ojo
        medicoid.hospital = body.hospital;
        
        medicoid.save((err, medicoActualizado) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors:err
                });
            }

            res.status(200).json({
                ok: true,
                medicoActualizado: medicoActualizado
            });           
        });
    });
});

// ================================
// Crear un nuevo hospita mdAutenticacion.verificaToken,
// ================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; //rq.body biene de la libreria body-parser.
    var _medico = new medicoModels({
        nombre: body.nombre,
        usuario: req.usuario._id, //es el id de un usuario ya creado y existente en la BD. (NO Es necesario colocar el id del usuario al crear el hospital)
        hospital: body.hospital,
    });

    _medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar medico',
                errors: err,
            });
        }

        res.status(201).json({
            ok: true,
            MEDICO: medicoGuardado,
        });
    });
});


// ================================
// Crear un nuevo medico mdAutenticacion.verificaToken,
// ================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; //rq.body biene de la libreria body-parser.
    var _medico = new medicoModels({
        nombre: body.nombre,
        usuario: req.usuario._id, //_id es como se guarda el id del usuario el la coleccion de la DB. llega al medico por el id del hospital (no es necesario colocarlo al crear el mdico)
        hospital: body.hospital //es el id de un hospital ya creado y existente en la BD. Trae el id del usuario. (Es necesario colocar el id del hospital al crear el médico)
    });

    _medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar medico',
                errors: err,
            });
        }

        res.status(201).json({
            ok: true,
            HOSPITAL: medicoGuardado,
        });
    });
});

// ================================
// Borrar un hospital por el ID
// ================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    medicoModels.findByIdAndRemove(id, (err, medicoBorrar) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors:err
            });
        }

        if ( !medicoBorrar ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no existe un medico con el id: ' + id,
                errors:err
            });
        }

        res.status(200).json({
            ok: true,
            medicoBorrar: medicoBorrar
        });     
    });
});


module.exports = app;
