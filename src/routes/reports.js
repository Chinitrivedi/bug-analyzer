const express = require('express');
const router = express.Router();
const { analyzeReport, getReports, getReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);

module.exports = router;