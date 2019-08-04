require("dotenv").config();
const express = require("express");

const app = express();

app.listen(process.env.PORT, () => {
  console.log(
    `🚀 Running tsb-hermes in ${process.env.NODE_ENV} mode on port ${
      process.env.PORT
    }`
  );
  require("./db/db");
  require("./rabbit/consumer-1");
});
