const axios = require("axios");
const process = require("process");

async function getResponse(messages) {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.GPT_BASE}/chat/completions`,
      headers: {
        "content-type": "application/json",
      },
      data: {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "Ошибка";
  }
}

module.exports = {
  getResponse,
};
