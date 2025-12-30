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

const getRencanakontrolnokp = async (req, res) => {
  try {
    const { bulan, tahun, noKP, filter } = req.params;
    if (!bulan || !tahun || !noKP || !filter) {
      return res.status(400).json({
        message: "Wajib isi bulan, tahun, noKP, dan filter",
      });
    }
    const dataBpjs = await bpjsService.getRencanakontrolnokp(
      bulan,
      tahun,
      noKP,
      filter
    );

    const finalResponse = {
      metaData: dataBpjs.metaData,
      response: dataBpjs.response,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    return handleError(res, error, "cekRencanaKontrol");
  }
};

const getRencanakontrol = async (req, res) => {
  try {
    const { tglAwal, tglAkhir, filter } = req.params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (
      !tglAwal ||
      !dateRegex.test(tglAwal) ||
      !tglAkhir ||
      !dateRegex.test(tglAkhir)
    ) {
      return res.status(400).json({
        message: "Format Tanggal Salah. Wajib YYYY-MM-DD (Contoh: 2025-12-22)",
      });
    }

    const dataBpjs = await bpjsService.getRencanakontrol(
      tglAwal,
      tglAkhir,
      filter
    );

    const finalResponse = {
      metaData: dataBpjs.metaData,
      response: dataBpjs.response,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    return handleError(res, error, "cekRencanaKontrol");
  }
};

module.exports = { getRencanakontrolnokp, getRencanakontrol };
