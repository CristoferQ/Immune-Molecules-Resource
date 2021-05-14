const express = require('express');
const path = require('path');
const app = express();

//settings
app.set('port', 80);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

//middlewares
app.use(express.urlencoded({extended: false}));
//routes
app.use(require('./routes/routes'));
//static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () =>{
    console.log("server on port:", app.get('port'));
});
module.exports = app;