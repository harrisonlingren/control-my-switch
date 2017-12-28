var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var Kasa = require("tplink-cloud-api");

var app = express();

async function init() {
  let user = process.env.kasauser,
    pass = process.env.kasapass;
  console.log(user, pass);
  console.log("logging in...");
  let kasa = await Kasa.login(user, pass);
  console.log("token", await kasa.getToken());
  console.log("devices: ", await kasa.getDeviceList());
  let smartSwitch = await kasa.getHS100(process.env.kasadevice);
  return smartSwitch;
}

async function on(smartSwitch) {
  try {
    let response = await smartSwitch.powerOn();
    console.log("smartSwitch: ", response.relay_state);
    if (response.relay_state == 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function off(smartSwitch) {
  try {
    let response = await smartSwitch.powerOff();
    console.log("smartSwitch: ", response.relay_state);
    if (response.relay_state == 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return true;
  }
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res, next) => {
  res.render("index", { state: true });
});

app.post("/on", async (req, res, next) => {
  try {
    let smartSwitch = await init();
    let result = await on(smartSwitch);
    res.status(200).json({ result: result });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

app.post("/off", async (req, res, next) => {
  try {
    let smartSwitch = await init();
    let result = await off(smartSwitch);
    res.status(200).json({ result: result });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
