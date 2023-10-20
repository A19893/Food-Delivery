import mongoose, { ConnectOptions } from "mongoose";

export const connectWithDatabase = () => {
  mongoose
  .connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connection to the database is successful");
  })
  .catch((error) => {
    console.error("Connection Error:",error);
  });
};

