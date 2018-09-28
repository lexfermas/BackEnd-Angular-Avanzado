var jwt = require('jsonwebtoken');

var _seed = require('../config/config').SEED;


// ================================
// Verificar token (esto es un middleware)
// ================================

exports.verificaToken = function (req, res, next) {

    var token = req.query.token;

    jwt.verify(token, _seed, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err,
            });
        }
        req.usuario = decoded.usuarioToken; //Para saber que usuario hace una accion (CRUD) sobre los otros usuarios
        next(); //permite que se ejecuten las funciones que estan mas abajo.
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
    });

}
