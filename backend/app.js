//import library
const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookiParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

//create app server using express
const app = express();

//create config to file .env
// const dotenv = require('dotenv')
// dotenv.config({
//   path: __dirname + '/.env'
// });
// dotenv.config()

// import route for api
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const cart = require("./routes/cartRoute");
const notification = require("./routes/notificationRoute");
const oneSignal = require("./routes/onesignalRoute");
const category = require("./routes/categoryRoute");

// increase limit file upload request
app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(cookiParser());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

// middleware
app.use(fileUpload());
app.use(cors());

//api
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", cart);
app.use("/api/v1", notification);
app.use("/api/v1", oneSignal);
app.use("/api/v1", category);

// all of code for route defalut
app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//Middleware error hander
app.use(errorMiddleware);

module.exports = app;
