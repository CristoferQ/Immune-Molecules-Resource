const {Router} = require('express');
const router = Router();

const {
    renderIndex, 
    renderAntibody, 
    renderAntigen,
    renderEpitope,
    renderSearch,
    renderTools,
    renderAbout,
    renderStructure,
    getSequence,
    renderProfile,
    getAntibody,
    getEpitope,
    getAntigen,
    getSearch,
    getGO,
    getMinMaxLength,
    renderAlignment,
    renderMapping,
    renderPhysicochemical,
    renderPredict_values,
    renderPredict_interaction,
    renderStatistical
} = require('../controllers/controller');

router.get('/', renderIndex);  //seteo la ruta y el controlador que trabajara con ella
router.get('/antibody', renderAntibody);
router.get('/antigen', renderAntigen);
router.get('/epitope', renderEpitope);
router.get('/search', renderSearch);
router.get('/tools', renderTools);
router.get('/about', renderAbout);
router.get('/structure/:structure?', renderStructure);
router.get('/profile/:type?/:id?', renderProfile);
//Services
router.get('/alignment', renderAlignment);
router.get('/mapping', renderMapping);
router.get('/physicochemical', renderPhysicochemical);
router.get('/predict_values', renderPredict_values);
router.get('/predict_interaction', renderPredict_interaction);
router.get('/statistical', renderStatistical);
//Apis
router.get('/getAntibody/:id?', getAntibody);
router.get('/getAntigen/:id?', getAntigen);
router.get('/getEpitope/:id?', getEpitope);
router.get('/getSequence/:structure?', getSequence);
router.post('/getSearch', getSearch);
router.post('/getGO', getGO);
router.get('/getMinMaxLength/:database', getMinMaxLength);
module.exports = router;