const {Router} = require('express');
const router = Router();


const {renderIndex, 
    renderAntibody, 
    renderAntigen,
    renderEpitope,
    renderSearch,
    renderTools,
    renderAbout} = require('../controllers/controller');

router.get('/', renderIndex); 
router.get('/antibody', renderAntibody);
router.get('/antigen', renderAntigen);
router.get('/epitope', renderEpitope);
router.get('/search', renderSearch);
router.get('/tools', renderTools);
router.get('/about', renderAbout);

module.exports = router;