let mongoose = require("mongoose");

async function dbConnection() {
  try {
    //Mongoose connection
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to database");
    });

    //Mongoose error
    mongoose.connection.on("error", (err) => {
      console.log(err.message);
    });

    //Mongoose disconnected
    mongoose.connection.on("Disconnected", () => {
      console.log("Mongoose connection is disconnected");
    });

    //db creation
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
  } catch (err) {
    return;
  }
}

//ctr +c
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = dbConnection;
