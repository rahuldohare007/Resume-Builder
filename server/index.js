let dbConnection = require("./config/db");
require("dotenv").config({});
let express = require("express");
const { authRoute } = require("./routes/authRoute");
let app = express();
let PORT = process.env.PORT || 8000;
app.use(express.json());

//Middleware configuration
dbConnection();

//For setting form data into req
//app.use(express.urlencoded({extended:true}))
//Route
app.use("/auth/v1", authRoute);

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      message: err.message,
    });
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Backend is connected : http://127.0.0.1:${PORT}`);
});
