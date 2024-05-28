let dbConnection = require("./config/db");
require("dotenv").config({});
let express = require("express");
const { authRoute } = require("./routes/authRoute");
let app = express();
let PORT = process.env.PORT || 8000;
app.use(express.json());
//middleware configuration
dbConnection();

//for setting form data into req
//app.use(express.urlencoded({extended:true}))
//route
app.use("/auth/v1", authRoute);
app.listen(PORT, () => {
  console.log(`Backend is connected : http://127.0.0.1:${PORT}`);
});
