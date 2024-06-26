const process = require("node:process");

process.on("uncaughtException", (code) => {
  console.error("UNHANDLED", code);
});

fetch("").then(console.log);