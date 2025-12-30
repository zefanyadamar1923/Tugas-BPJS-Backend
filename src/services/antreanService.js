const axios = require("axios");
const config = require("../config/bpjsConfig");
const { getDatesInRange } = require("../utils/dateHelper");

const getDataPerTanggal = async (tanggal) => {
  try {
    console.log(`[SERVICE] Fetching date: ${tanggal}`);

    const resList = await axios.get(`${config.URL_LIST}/${tanggal}`, {
      headers: config.HEADERS,
    });
    const listPasien = resList.data?.response?.list || [];

    if (!Array.isArray(listPasien) || listPasien.length === 0) return [];

    const detailRequests = listPasien.map(async (pasien) => {
      let taskData = [];
      try {
        const resTask = await axios.post(
          config.URL_TASK,
          {
            kodebooking: pasien.kodebooking,
          },
          { headers: config.HEADERS }
        );

        if (resTask.data?.response?.list) taskData = resTask.data.response.list;
        else if (Array.isArray(resTask.data)) taskData = resTask.data;
      } catch (e) {}

      const taskColumns = {
        task1: "",
        task2: "",
        task3: "",
        task4: "",
        task5: "",
        task6: "",
        task7: "",
      };

      if (Array.isArray(taskData)) {
        taskData.forEach((t) => {
          if (t.taskid >= 1 && t.taskid <= 7) {
            taskColumns[`task${t.taskid}`] = t.wakturs;
          }
        });
      }

      return {
        ...pasien,
        ...taskColumns,
      };
    });

    return await Promise.all(detailRequests);
  } catch (error) {
    console.error(`[ERROR] Date ${tanggal}: ${error.message}`);
    return [];
  }
};

exports.getAntreanRange = async (startDate, endDate) => {
  const listTanggal = getDatesInRange(startDate, endDate);

  const promises = listTanggal.map((tgl) => getDataPerTanggal(tgl));
  const results = await Promise.all(promises);

  return results.flat();
};
