const axios = require("axios");
const process = require("process");
async function getResponse(data) {
  try {
    const response = await axios.request({
      method: "POST",
      url: `https://${process.env.GPT_API_HOST}/`,
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.GPT_API_KEY,
        "X-RapidAPI-Host": process.env.GPT_API_HOST,
      },
      data,
    });

    console.log(response.data);
    return response.data.text;
  } catch (error) {
    console.log(error);
    return "Ошибка";
  }
}

module.exports = {
  getResponse,
};
