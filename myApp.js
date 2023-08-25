let express = require("express");
let app = express();

app.use("/public", express.static(__dirname + "/public"));

app.use((req, res, next) => {
  console.log(req.method, req.path, " - ", req.ip);
  next();
});

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
  const message =
    process.env["MESSAGE_STYLE"] === "uppercase"
      ? "Hello json".toUpperCase()
      : "Hello json";
  res.json({ message });
});

app.get(
  "/now",
  (req, res, next) => {
    const timeValue = new Date();
    console.log("timeValue", timeValue);
    req.time = timeValue;
    next();
  },
  (req, res, next) => {
    res.json({ time: req.time });
    console.log("middleware 2");
    next();
  }
);

app.get("/:word/echo", (req, res, next) => {
  if (!req.params.word) {
    return;
  }
  res.json({
    echo: req.params.word,
  });

  next();
});

module.exports = app;
