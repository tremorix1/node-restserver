const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req,res){

let tipo = req.params.tipo;
let id = req.params.id;

if(!req.files){
  return res.status(400)
  .json({
    ok: false,
    err: {
      message: 'No se ha seleccionado ningun archivo'
    }
    });
  }

// valida tipo

let tiposValidos = ['productos','usuarios'];
if (tiposValidos.indexOf(tipo)<0){

  return res.status(400).json({
    ok: false,
    err: {
      message: 'Los tipos validos son: ' + tiposValidos.join(', '),
      tipoErroneo: tipo
    }
  });

}
let sampleFile = req.files.archivo;
let nameCut = sampleFile.name.split('.');
let extension = nameCut[nameCut.length -1];
// extensiones validas
let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

if (extensionesValidas.indexOf(extension)<0){
  return res.status(400).json({
    ok: false,
    err: {
      message: 'Las extensiones validas son: ' + extensionesValidas.join(', '),
      ext: extension
    }
  });
}
// cambiar name File
let nameFile = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

sampleFile.mv(`uploads/${ tipo }/${ nameFile }`, (err)=>{
  if (err) {
    return res.status(500).json({
      ok:false,
      err
    });
  }
  // aqui la imagen se cargó
  if(tipo==='usuarios'){
    imagenUsuario(id,res,nameFile);
  }else{
    imagenProducto(id,res,nameFile);

  }

});

});
function imagenUsuario(id, res, nameFile) {
  Usuario.findById(id, (err, usuarioDB)=>{
    if(err){
      borraArchivo(nameFile, 'usuarios')
      return status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB){
      borraArchivo(nameFile, 'usuarios')
      return status(400).json({
        ok: false,
        err:{
          message: 'Usuario no existe'
        }
      });
    }

    //let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);

    //if(fs.existsSync(pathImagen)){
    //  fs.unlinkSync(pathImagen);
  //  }
borraArchivo(usuarioDB.img, 'usuarios')
    usuarioDB.img = nameFile;
    usuarioDB.save((err, usuarioGuardado)=>{
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nameFile
      });
    });
  });
}

function imagenProducto(id, res, nameFile) {

  Producto.findById(id, (err, productoDB)=>{
    if(err){
      borraArchivo(nameFile, 'productos')
      return status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB){
      borraArchivo(nameFile, 'productos')
      return status(400).json({
        ok: false,
        err:{
          message: 'Producto no existe'
        }
      });
    }

    //let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${ usuarioDB.img }`);

    //if(fs.existsSync(pathImagen)){
    //  fs.unlinkSync(pathImagen);
  //  }
  borraArchivo(productoDB.img, 'productos')
    productoDB.img = nameFile;
    productoDB.save((err, productoGuardado)=>{
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nameFile
      });
    });
  });

}

function borraArchivo(nombreImagen, tipo){
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

  if(fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen);
  }
}
module.exports = app;
