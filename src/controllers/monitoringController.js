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

const getMonitoringKunjungan = async (req, res) => {
  try {
    const { tglMonitor, jenisLayanan } = req.params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!tglMonitor || !dateRegex.test(tglMonitor)) {
      return res.status(400).json({
        message: "Format Tanggal Salah. Wajib YYYY-MM-DD (Contoh: 2025-12-22)",
      });
    }

    if (jenisLayanan !== "1" && jenisLayanan !== "2") {
      return res.status(400).json({
        metaData: {
          code: "400",
          message: "Jenis Pelayanan harus '1' (Inap) atau '2' (Jalan)",
        },
      });
    }

    const dataBpjs = await bpjsService.getMonitoringKunjungan(
      tglMonitor,
      jenisLayanan
    );

    console.log("✅ Data Monitoring Ditemukan");

    const finalResponse = {
      metaData: dataBpjs.metaData,
      response: dataBpjs.response,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    return handleError(res, error, "getMonitoring");
  }
};

const getMonitoringHistoriPelayanan = async (req, res) => {
  try {
    const { noKP, tglMulai, tglAkhir } = req.params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
      !tglMulai ||
      !dateRegex.test(tglMulai) ||
      !tglAkhir ||
      !dateRegex.test(tglAkhir)
    ) {
      return res.status(400).json({
        message: "Format Tanggal Salah. Wajib YYYY-MM-DD (Contoh: 2025-12-22)",
      });
    }
    const dataBpjs = await bpjsService.getMonitoringHistoriPelayanan(
      noKP,
      tglMulai,
      tglAkhir
    );

    console.log("✅ Data Monitoring Histori Pelayanan Ditemukan");

    const finalResponse = {
      metaData: dataBpjs.metaData,
      response: dataBpjs.response,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    return handleError(res, error, "getMonitoringHistoriPelayanan");
  }
};

module.exports = { getMonitoringKunjungan, getMonitoringHistoriPelayanan };
