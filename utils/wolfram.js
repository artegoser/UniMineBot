const axios = require("axios");
const process = require("process");
async function wolfram(expr) {
  let result;

  try {
    const resp = await axios.get(
      `http://api.wolframalpha.com/v2/query?input=${encodeURI(expr)}&appid=${
        process.env.WOLFRAM_APPID
      }&format=plaintext&output=JSON`
    );

    for (let pod of resp.data.queryresult.pods) {
      if (pod.primary === true) {
        result = `Решение: ${pod.subpods[0].plaintext}`;
        break;
      }
    }
  } catch (e) {
    result = `Ошибка: ${e.message}`;
  }

  return result;
}

module.exports = wolfram;
