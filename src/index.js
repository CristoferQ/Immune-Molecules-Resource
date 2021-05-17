const express = require('express'); //importa el servidor
const path = require('path'); //sirve para acceder a rutas
const app = express(); //crea la variable app que es el servidor

//settings
app.set('port', 5001); //setea el puerto
app.set('views', path.join(__dirname, 'views')); //deja como carpeta base 'views'

app.set('view engine', 'ejs'); //setea el motor de plantillas ejs

//middlewares
app.use(express.urlencoded({extended: false}));
//routes
app.use(require('./routes/routes')); //setea la carpeta base de rutas
//static files
app.use(express.static(path.join(__dirname, 'public'))); //setea la carpeta base de public

app.listen(app.get('port'), () =>{ //pone el server a escucha
    console.log("server on port:", app.get('port'));
});
module.exports = app;