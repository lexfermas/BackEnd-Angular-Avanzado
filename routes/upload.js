var express = require('express');

var fileUpload = require('express-fileupload'); //libreria para subir imagenes l server

var app = express();

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) =>{

    var tipo = req.params.tipo;
    var idUsuario = req.params.id; 

    // Tipos de archivos para las colecciones en la DB
    var tiposValidos = ['hospitales', 'medicos','usuarios'];
    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Tipo de colección no es valida',
            errors: {message:'las extensiones validad son: ' + tiposValidos.join(', ')}  
        });
    }


    if(!req.files){
        return res.status(400).json({
            ok: false,
            message: 'No se subio nada',
            errors: {message:'Debe seleccionar una imagen'} 
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //extensiones aceptadas
    var extensionesValidas = ['png','PNG','jpg','JPG','jpeg','JPEG'];
    if(extensionesValidas.indexOf(extensionArchivo) < 0 ){
            return res.status(400).json({
                ok: false,
                message: 'Extensión no valida',
                errors: {message:'las extensiones validad son: ' + extensionesValidas.join(', ')} 
                //extensionesValidas.join(', ') devuelve todas las extensiones que estan en el arreglo separadas por un espacio y una ,
            });
    }

    //Nombre de archivo personalizado

    var nombreArchivo = `${idUsuario}-${new Data().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporar a un Path especifico.

    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(00).json({
                ok: false,
                message: 'Error al mover archivos',
                errors: err
               
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreCortado,
            extensionArchivo
        })
        
    });

});

module.exports = app;
