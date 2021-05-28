const indexCtrl = {};
const {PythonShell} = require('python-shell');
var fs = require('fs');
const parsePdb = require('parse-pdb');
var Antibody = require("../models/antibody");
var Antigen = require("../models/antigen");
//controlador que sirve para renderizar la vista
indexCtrl.renderIndex = (req,res) =>{
    var sliderfiles = fs.readdirSync('./src/public/img/slider').map(file => "./img/slider/" + file)
    res.render('index', {title: "TITULO INICIO", sliderfiles: sliderfiles});
};
indexCtrl.renderAntibody = (req,res) =>{
    res.render('antibody', {title: "TITULO ANTIBODY"});
};
indexCtrl.renderAntigen = (req,res) =>{
    res.render('antigen', {title: "TITULO ANTIGEN"});
};
indexCtrl.renderEpitope = (req,res) =>{
    res.render('epitope', {title: "TITULO EPITOPE"});
};
indexCtrl.renderSearch = (req,res) =>{
    res.render('search', {title: "TITULO SEARCH"});
};
indexCtrl.renderTools = (req,res) =>{
    res.render('tools', {title: "TITULO TOOLS"});
};
indexCtrl.renderAbout = (req,res) =>{
    res.render('about', {title: "TITULO ABOUT"});
};
indexCtrl.renderStructure = (req,res) =>{
    let structure = req.params.structure;
    res.render('structure', {title: "TITULO STRUCTURE", structure: req.params.structure});
};
indexCtrl.renderProfile = (req, res)=>{
    let id = req.params.id;
    let type = req.params.type;
    if(type == "antibody"){
        Antibody.findOne({id_sequence: id}, {}).exec((err, data)=>{
            res.render('profile-antibody', {title: "TITULO PROFILE", data: data});
        })
    }
    if(type == "antigen"){
        Antigen.findOne({id_sequence: id}, {}).exec((err, data) =>{
            res.render('profile-antigen', {title: "TITULO PROFILE", id: id, data: data});
        })
    }
    if(type == "epitope"){
        res.render('profile-epitope', {title: "TITULO EPITOPE", id: id});
    }
};
indexCtrl.getAntigen = (req, res) =>{
    let id = req.params.id;
    Antigen.find({id_sequence: id}, {}).exec((err, data)=>{
        return res.status(200).send(data)
    })
}
indexCtrl.getAntibody = (req, res) =>{
    let id = req.params.id;
    Antibody.find({id_sequence: id},{}).exec((err, data)=>{
        return res.status(200).send(data)
    })
}
indexCtrl.getEpitope = (req, res) =>{
    let id = req.params.id;
    Epitope.find({id_sequence: id},{}).exec((err, data)=>{
        return res.status(200).send(data)
    })
}
indexCtrl.getSequence = (req, res) => {
    let options = {
        pythonOptions: ["-W", "ignore"],
        args: [req.params.structure]
    };
    PythonShell.run('src/scripts/getSequenceFromStructure.py', options, function(err, results){
        let data = JSON.parse(results);
        return res.status(200).send(data)
    })
};
module.exports = indexCtrl;