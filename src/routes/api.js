const express = require("express");
const router = express.Router();
const antreanController = require("../controllers/antreanController");
const pesertaController = require("../controllers/pesertaController");
const monitoringController = require("../controllers/monitoringController");
const rencanakontrolController = require("../controllers/rencanakontrolController");

router.get("/bpjs/peserta/:nik/:tglSEP", pesertaController.getPeserta);
router.get(
  "/bpjs/monitoring/kunjungan/:tglMonitor/:jenisLayanan",
  monitoringController.getMonitoringKunjungan
);
router.get(
  "/bpjs/rencanakontrol/:tglAwal/:tglAkhir/:filter",
  rencanakontrolController.getRencanakontrol
);
router.get(
  "/bpjs/rencanakontrol/noKP/:bulan/:tahun/:noKP/:filter",
  rencanakontrolController.getRencanakontrolnokp
);
router.post("/bpjs", antreanController.getJSONReport);

module.exports = router;
