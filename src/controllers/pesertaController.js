const bpjsService = require("../services/bpjsService");

const handleError = (res, error, context) => {
  console.error(`Error di ${context}:`, error.message);

  if (error.response) {
    console.log("BPJS Response:", JSON.stringify(error.response.data, null, 2));
    return res.status(error.response.status).json(error.response.data);
  } else if (error.request) {
    console.log("Timeout/Network Error ke BPJS");
    return res
      .status(504)
      .json({ message: "Tidak ada respon dari server BPJS" });
  }

  return res.status(500).json({
    message: "Terjadi kesalahan internal",
    detail: error.message,
  });
};

const getPeserta = async (req, res) => {
  try {
    const { nik, tglSEP } = req.params;

    const dataBpjs = await bpjsService.getPeserta(nik, tglSEP);

    return res.status(200).json(dataBpjs);
  } catch (error) {
    return handleError(res, error, "cekPeserta");
  }
};

module.exports = { getPeserta };
