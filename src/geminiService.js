const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeBugReport = async (rawReport) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a senior QA engineer. Analyze the following bug report and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

The JSON must have exactly these fields:
{
  "category": "one of: UI, API, Performance, Security, Logic",
  "severity": "one of: Critical, High, Medium, Low",
  "title": "concise 1-line bug title",
  "stepsToReproduce": ["step 1", "step 2", "step 3"],
  "expectedBehavior": "what should have happened",
  "actualBehavior": "what actually happened",
  "probableRootCause": "likely technical cause",
  "suggestedFix": "recommended fix"
}

Bug Report:
${rawReport}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean response and parse JSON
  const cleaned = text.replace(/```json|```/g, '').trim();
  const analysis = JSON.parse(cleaned);

  return analysis;
};

module.exports = { analyzeBugReport };
