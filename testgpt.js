const { getResponse } = require("./utils/gpt");
require("dotenv").config();

getResponse([{ role: "user", content: "Say this is a test" }]).then(
  console.log
);
