const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');

// Importar produtos da FakeStore API
router.post('/fakestore', importController.importFromFakeStore);

module.exports = router;