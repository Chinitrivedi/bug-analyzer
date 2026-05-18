const Report = require('../models/Report');
const { analyzeBugReport } = require('../geminiService');

// @route POST /api/reports/analyze
const analyzeReport = async (req, res) => {
  try {
    const { rawReport } = req.body;

    if (!rawReport) {
      return res.status(400).json({ message: 'Please provide a bug report' });
    }

    // Call Gemini AI
    const analysis = await analyzeBugReport(rawReport);

    // Save to MongoDB
    const report = await Report.create({
      user: req.user._id,
      rawReport,
      analysis
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reports/:id
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Make sure user owns report
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeReport, getReports, getReport };
