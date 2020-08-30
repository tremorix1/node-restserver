

//===============================================
//Puerto
//===============================================

process.env.PORT = process.env.PORT || 3000;

//===============================================
//Entorno
//===============================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============================================
//Data Base
//===============================================

let urlDB;
if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}
else{
  urlDB = 'mongodb+srv://tremorix1:CkQT3MSUJTJBW2MV@cluster0.fqksy.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
