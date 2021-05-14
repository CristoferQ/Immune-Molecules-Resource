const indexCtrl = {};
const { response } = require('express');

indexCtrl.renderIndex = async(req,res) =>{
    res.render('index');
};
indexCtrl.renderAntibody = async(req,res) =>{
    res.render('antibody');
};
indexCtrl.renderAntigen = async(req,res) =>{
    res.render('antigen');
};
indexCtrl.renderEpitope = async(req,res) =>{
    res.render('epitope');
};
indexCtrl.renderSearch = async(req,res) =>{
    res.render('search');
};
indexCtrl.renderTools = async(req,res) =>{
    res.render('tools');
};
indexCtrl.renderAbout = async(req,res) =>{
    res.render('about');
};

module.exports = indexCtrl;