var express = require('express');
var bcrypt = require('bcryptjs'); //para encriptar la contraseña

// var jwt = require('jsonwebtoken');
// var _seed = require('../config/config').SEED;

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//permite usar todas las funciones y metodos que tiene el usuarioSchema.
var usuarioModels = require('../models/usuario');

// ==================================================
//                  Listar Ususarios
// ==================================================

app.get('/', (req, res, next) => {

    //Query para listar los usuarios en el listado no se muestra el password
    usuarioModels.find({}, 'nombre email img role')
        .exec(
            (err, todosUsuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuario',
                        errors: err,
                    });
                }
                res.status(200).json({
                    ok: true,
                    todosUsuario
                });
            });
});

// // ================================
// // Verificar token (esto es un middleware)
// // ================================

// app.use('/', (req, res, next) => {
    
//     var token = req.query.token;

//     jwt.verify( token, _seed, (err, decode ) =>{
        
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Token incorrecto',
//                 errors: err,
//             });
//         }
//         next(); //permite que se ejecuten las funciones que estan mas abajo.
//     });

// });

// ================================
// Actualizar un nuevo Usuario
// ================================

app.put('/:id', (req, res) =>{

    var id = req.params.id;
    var body = req.body;

    usuarioModels.findById(id, (err, usuarioid) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error, usuario no encontrdo',
                errors: err,
            });
        }

        if(!usuarioid){
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: {message: 'no exixste el usuario'},
                });
            }
        }

        usuarioid.nombre = body.nombre;
        usuarioid.email = body.email;
        usuarioid.role = body.role;

        usuarioid.save((err, usuarioActualizado) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors:err
                });
            }

            usuarioActualizado.password = ':)'; //para no mostrar la encriptacion de la password sino la :)

            res.status(200).json({
                ok: true,
                usuarioActualizado: usuarioActualizado
            });           
        });
    });
});


// ================================
// Crear un nuevo Usuario
// ================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body; //rq.body biene de la libreria body-parser.
    var _usuario = new usuarioModels({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),  //encripta la contraseña
        img: body.img,
        role: body.role
    });

    _usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                errors: err,
            });
        }

        res.status(201).json({
            ok: true,
            USUARIO: usuarioGuardado,
            usuarioToken: req.usuario,
        });
    });
});


// ================================
// Borrar un nuevo Usuario por el ID
// ================================

app.delete('/:id', (req, res) => {

    var id = req.params.id;

    usuarioModels.findByIdAndRemove(id, (err, usuarioBorrar) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors:err
            });
        }

        if ( !usuarioBorrar ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no existe un usuario con el id: ' + id,
                errors:err
            });
        }

        res.status(200).json({
            ok: true,
            usuarioBorrar: usuarioBorrar
        });     

    });
});

module.exports = app;
