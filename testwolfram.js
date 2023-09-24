const wolfram = require("./utils/wolfram");
require("dotenv").config();
wolfram("x+2=3").then((v) => console.log(v));
