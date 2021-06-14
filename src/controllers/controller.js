const indexCtrl = {};
const {PythonShell} = require('python-shell');
var fs = require('fs');
const parsePdb = require('parse-pdb');
var Antibody = require("../models/antibody");
var Antigen = require("../models/antigen");
var Epitope = require("../models/epitope");
var GO_Pfam = require("../models/go_pfam");
var AntibodySearchView = require("../models/AntibodySearchView");
var AntigenSearchView = require("../models/AntigenSearchView");
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
    res.render('structure', {title: "TITULO STRUCTURE", structure: req.params.structure});
};
indexCtrl.renderProfile = (req, res)=>{
    let id = req.params.id;
    let type = req.params.type;
    if(type == "Antibody"){
        Antibody.findOne({id_sequence: id}, {}).exec((err, data)=>{
            res.render('profile-antibody', {title: "TITULO PROFILE", data: data});
        })
    }
    if(type == "Antigen"){
        Antigen.findOne({id_sequence: id}, {}).exec((err, data) =>{
            res.render('profile-antigen', {title: "TITULO PROFILE", id: id, data: data});
        })
    }
    if(type == "Epitope"){
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
indexCtrl.getSearch = (req, res) => {
    //Obtención de la data desde el frontend
    let Colection = req.body["type"];
    let minLength = req.body["min"];
    let maxLength = req.body["max"];
    let pfam = req.body["pfam"];
    let go_cc = req.body["go_cc"];
    let go_mf = req.body["go_mf"];
    let go_bp = req.body["go_bp"];
    let chain = req.body["chain"];
    let has_pdb = req.body["has_pdb"];
    let pdb_id = req.body["pdb_id"];
    let has_epitope;
    if(Colection == "Antigen"){
        has_epitope = req.body["has_epitope"];
    }
    //Se arma el diccionario query
    query = {}
    query["Length"] = {"$gt": parseInt(minLength), "$lt": parseInt(maxLength)}
    if(pfam != ""){query["Pfam"] = pfam;}
    if(go_cc != ""){query["GO_Celular_Component"] = go_cc;}
    if(go_mf != ""){query["GO_Molecular_Function"] = go_mf;}
    if(go_bp != ""){query["GO_Biological_Process"] = go_bp;}
    if(chain != ""){query["Type"] = chain;}
    if(has_pdb == "true"){query["has_pdb"] = 1;}
    if(pdb_id != ""){query["pdb_id"] = pdb_id;}
    if(has_epitope == "true"){query["has_epitopes"] = 1;}
    //Consultas y envío
    if(Colection == "Antigen"){
        AntigenSearchView.find(query, {"_id": 0}).exec((err, data)=>{
            console.log(data)
            return res.status(200).send(data)
        })
    };
    if(Colection == "Antibody"){
        AntibodySearchView.find(query, {"_id": 0}).exec((err, data)=>{
            console.log(data)
            return res.status(200).send(data)
        })
    }
}
indexCtrl.getGO = (req, res)=>{ 
    if(req.body['type'] == "Antibody"){
        GO_Pfam.findOne({"Colection": "antibody"},{}).exec((err, data)=>{
            return res.status(200).send(data)
        })
    }
    if(req.body['type'] == "Antigen"){
        GO_Pfam.findOne({"Colection": "antigen"},{}).exec((err, data)=>{
            return res.status(200).send(data)
        })
    }
};
indexCtrl.getMinMaxLength = (req, res)=> {
    let database = req.params.database
    if(database == "Antibody"){
        AntibodySearchView.aggregate([{$group: {_id: null, min: {$min: "$Length"}, max: { $max: "$Length"}}}]).exec((err, data)=>{
            let minLength = data[0].min;
            let maxLength = data[0].max;
            return res.status(200).send({min: minLength, max: maxLength})
        })
    }
    if(database == "Antigen"){
        AntigenSearchView.aggregate([{$group: {_id: null, min: {$min: "$Length"}, max: { $max: "$Length"}}}]).exec((err, data)=>{
            let minLength = data[0].min;
            let maxLength = data[0].max;
            return res.status(200).send({min: minLength, max: maxLength})
        })
    }
}
module.exports = indexCtrl;