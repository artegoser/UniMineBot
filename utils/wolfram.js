const axios = require("axios");
const process = require("process");
async function wolfram(expr) {
  let result = "";

  try {
    const resp = await axios.get(
      `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(
        expr
      )}&appid=${encodeURIComponent(
        process.env.WOLFRAM_APPID
      )}&format=plaintext&output=JSON`
    );

    console.log(JSON.stringify(resp.data));

    let solutions = 0;
    for (let pod of resp.data.queryresult.pods) {
      if (pod.primary === true) {
        result += `Решение ${++solutions}: ${pod.subpods
          .map((subpod) => `${subpod.plaintext}`)
          .join("\n")}\n`;
      }
    }
  } catch (e) {
    result = `Ошибка: ${e.message}`;
  }

  return result;
}

module.exports = wolfram;
