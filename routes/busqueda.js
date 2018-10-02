var express = require('express');

var app = express();

var hospitalBusqueda = require('../models/hospital');
var medicoBusqueda = require('../models/medico');
var usuarioBusqueda = require('../models/usuario');

//===================================
//  Busqueda Por colección
//===================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var promesa;
    var regex = new RegExp(busqueda, 'i')

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda son: usuarios, hospitales y médicos',
                error: { message: 'Tabla o colección no valida' }

            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data, //[tabla] es una propiedad de obj computada o procesadas. es decir en ves de la palabra tabla aparece el nombre de la colección.

        });
    });
});

//===================================
//  Busqueda general
//===================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i') //expresion regular para que la busqueda se insencible a mayusculas y minusqulas

    Promise.all([                         //Promise.all es de ES6 para hacer busqueda de todas las promesas al mismo tiempo
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuario(busqueda, regex)
    ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
            });
        });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        hospitalBusqueda.find({ nombre: regex })
            .populate('usuario', 'nombre')
            .exec((err, hospitalBuscado) => {
                if (err) {
                    reject('error al cargar hospitales', err)
                } else {
                    resolve(hospitalBuscado);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        medicoBusqueda.find({ nombre: regex })
            .populate('usuario', 'nombre')
            .populate('hospitales', 'nombre')
            .exec((err, medicoBuscado) => {
                if (err) {
                    reject('error al cargar medicos', err)
                } else {
                    resolve(medicoBuscado);
                }
            });
    });
}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        usuarioBusqueda.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarioBuscado) => {
                if (err) {
                    reject('Error al buscar usuario');
                } else {
                    resolve(usuarioBuscado);
                }
            });
    });
}

module.exports = app;
