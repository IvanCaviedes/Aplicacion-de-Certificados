const express = require('express');
const pdf = require('express-pdf');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
// settings
app.set('port', process.env.PORT || 3000 );
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultlayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs'); 
// midelwares
app.use(express.urlencoded({extended: false}));
app.use(pdf);
//Routes
app.use('/', require('./routes/api'))
//Archivos Estaticos
app.use(express.static(path.join(__dirname, 'public')));
//Exportandolo
module.exports = app;