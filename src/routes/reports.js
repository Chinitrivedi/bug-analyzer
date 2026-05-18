const express = require('express');
const router = express.Router();
const { analyzeReport, getReports, getReport, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
router.delete('/:id', protect, deleteReport);

module.exports = router;