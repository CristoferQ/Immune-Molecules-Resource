const indexCtrl = {};

//controlador que sirve para renderizar la vista
indexCtrl.renderIndex = (req,res) =>{
    res.render('index', {title: "TITULO INICIO"}); //le paso la variable a ejs
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

module.exports = indexCtrl;