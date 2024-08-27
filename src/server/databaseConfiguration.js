const mongoose = require("mongoose");

try {
  mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("Database connected successfully."));
} catch (error) {
  console.log(error);
}
