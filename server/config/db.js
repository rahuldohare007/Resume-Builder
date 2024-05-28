let mongoose = require("mongoose");
async function dbConnection() {
  try {
    // mongoose connection
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to db");
    });
    //mongoose error
    mongoose.connection.on("error", (err) => {
      console.log(err.message);
    });
    //mongoose disconnected
    mongoose.connection.on("Disconnected", () => {
      console.log("Mongoose connection is disconnected");
    });

    //db creation
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
  } catch (err) {
    console.log(err);
    return;
  }
}
//ctr +c
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = dbConnection;
