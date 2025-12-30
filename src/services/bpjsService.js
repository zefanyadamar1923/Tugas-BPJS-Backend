const axios = require("axios");
const config = require("../config/bpjsConfig");
const {
  generateTimestamp,
  generateSignature,
  decryptResponse,
} = require("../utils/cryptoHelper");

console.log(config);

const _sendRequest = async (endpoint, method = "GET", data = null) => {
  const timestamp = generateTimestamp();
  const signature = generateSignature(
    config.consId,
    config.secretKey,
    timestamp
  );

  const headers = {
    "X-cons-id": config.consId.toString(),
    "X-timestamp": timestamp.toString(),
    "X-signature": signature,
    user_key: config.userKey,
    "Content-Type": "application/json; charset=utf-8",
  };

  const url = `${config.baseUrl}${endpoint}`;
  console.log("Headers:", headers);
  console.log("BPJS req:", `${method} ${url}`);
  console.log("BASE_URL:", config.baseUrl);
  console.log("Endpoint:", endpoint);
  console.log("Final URL:", url);

  try {
    const options = { method, url, headers };
    if (data && method !== "GET") options.data = data;

    const response = await axios(options);
    if (
      response.data.metaData.code === "200" &&
      typeof response.data.response === "string"
    ) {
      console.log("Respon terenkripsi, melakukan proses decrypt...");

      const decrypted = decryptResponse(
        response.data.response,
        config.consId,
        config.secretKey,
        timestamp
      );

      if (decrypted) {
        response.data.response = decrypted;
      }
    }

    return response.data;
  } catch (error) {
    console.error("BPJS Error:", error.response?.data || error.message);
    throw error;
  }
};

const getPeserta = async (nik, tglSEP) => {
  const endpoint = `/Peserta/nik/${nik}/tglSEP/${tglSEP}`;
  console.log("🛠️ Cek Endpoint Peserta:", endpoint);
  return await _sendRequest(endpoint, "GET");
};

const getMonitoringKunjungan = async (tglMonitor, jenisLayanan) => {
  const endpoint = `/Monitoring/Kunjungan/Tanggal/${tglMonitor}/JnsPelayanan/${jenisLayanan}`;
  console.log("🛠️ Cek Endpoint Monitoring:", endpoint);
  return await _sendRequest(endpoint, "GET");
};

const getRencanakontrol = async (tglAwal, tglAkhir, filter) => {
  const endpoint = `/RencanaKontrol/ListRencanaKontrol/tglAwal/${tglAwal}/tglAkhir/${tglAkhir}/filter/${filter}`;
  console.log("🛠️ Cek Endpoint Rencana Kontrol:", endpoint);
  console.log("tglAwal:", tglAwal, "tglAkhir:", tglAkhir, "filter:", filter);
  return await _sendRequest(
    endpoint,
    "GET",
    null,
    "Application/x-www-form-urlencoded"
  );
};

const getRencanakontrolnokp = async (bulan, tahun, noKP, filter) => {
  const endpoint = `/RencanaKontrol/ListRencanaKontrol/Bulan/${bulan}/Tahun/${tahun}/Nokartu/${noKP}/filter/${filter}`;
  console.log("🛠️ Cek Endpoint Rencana Kontrol:", endpoint);
  console.log(
    "bulan:",
    bulan,
    "tahun:",
    tahun,
    "noKP:",
    noKP,
    "filter:",
    filter
  );
  return await _sendRequest(
    endpoint,
    "GET",
    null,
    "Application/x-www-form-urlencoded"
  );
};

module.exports = {
  getPeserta,
  getMonitoringKunjungan,
  getMonitoringHistoriPelayanan,
  getRencanakontrolnokp,
  getRencanakontrol,
};
