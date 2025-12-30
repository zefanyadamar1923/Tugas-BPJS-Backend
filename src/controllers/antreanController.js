const antreanService = require("../services/antreanService");

exports.getJSONReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Wajib isi startDate & endDate" });
    }

    const data = await antreanService.getAntreanRange(startDate, endDate);

    res.json({
      metadata: { code: 200, message: "OK", count: data.length },
      response: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
