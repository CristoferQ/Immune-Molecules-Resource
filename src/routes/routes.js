const {Router} = require('express');
const router = Router();

const {renderIndex, 
    renderAntibody, 
    renderAntigen,
    renderEpitope,
    renderSearch,
    renderTools,
    renderAbout,
    renderStructure} = require('../controllers/controller');

router.get('/', renderIndex);  //seteo la ruta y el controlador que trabajara con ella
router.get('/antibody', renderAntibody);
router.get('/antigen', renderAntigen);
router.get('/epitope', renderEpitope);
router.get('/search', renderSearch);
router.get('/tools', renderTools);
router.get('/about', renderAbout);
router.get('/structure/:structure?', renderStructure);
module.exports = router;