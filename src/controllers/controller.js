const indexCtrl = {};
const { response } = require('express');

//controlador que sirve para renderizar la vista
indexCtrl.renderIndex = (req,res) =>{
    res.render('index', {title: "TITULO INICIO"}); //le paso la variable a ejs
};
indexCtrl.renderAntibody = (req,res) =>{
    res.render('antibody', {title: "TITULO ANTIBODY"});
};
indexCtrl.renderAntigen = (req,res) =>{
    res.render('antigen');
};
indexCtrl.renderEpitope = (req,res) =>{
    res.render('epitope');
};
indexCtrl.renderSearch = (req,res) =>{
    res.render('search');
};
indexCtrl.renderTools = (req,res) =>{
    res.render('tools');
};
indexCtrl.renderAbout = (req,res) =>{
    res.render('about');
};

module.exports = indexCtrl;