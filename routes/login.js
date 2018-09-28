var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var _seed = require('../config/config').SEED; //es lo que hace que el token sea diferente

var app = express();
var usuarioModels = require('../models/usuario');

app.post('/', (req, res) =>{

    var body = req.body;

    usuarioModels.findOne({email: body.email }, (err, usuarioDB) =>{
       
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors:err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorreetas - email',
                errors:err
            });
        }

        if( !bcrypt.compareSync( body.password, usuarioDB.password )){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorreetas - password',
                errors:err
            });
        }

        //Crear un token
        usuarioDB.password = ':)'
        // usuarioToken: usuarioDB este se conoce como pailook
        //@este-es@-un-seed-dificil: es lo que hace que el token sea unico
        //expiresIn: 14400 es el tiempo de duracion del token (4 hrs)

        var token = jwt.sign({usuarioToken: usuarioDB}, _seed, {expiresIn: 14400});

       
        res.status(200).json({
            ok: true,
            usuarioDB: usuarioDB,
            token: token,
            id: usuarioDB.id
        });  
    })

       

})


module.exports = app;