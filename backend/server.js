
const dotenv = require("dotenv")
  
dotenv.config({path:__dirname+'/config.env'})

const app = require("./app");

const http = require("http").createServer(app);

const socketHandle = require('./socket/socket')

const io = require("socket.io")(http, {
  cors: true,
  origins: ["http://locahost:5000"],
});
dotenv.config({path:__dirname+'/.env'})


const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//config
// const dotenv = require('dotenv')
// dotenv.config({path:__dirname+'/.env'})
// dotenv.config()



//connect database
connectDatabase();

//socket ket realtime for comment
socketHandle(io)

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is running on port:${process.env.PORT}`
  );
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});


//export io
module.exports = io