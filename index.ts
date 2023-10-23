import express from "express";
import App from "./services/ExpressApp";
import ConnectWithDataBase from "./services/DataBase";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.dev" });

const StartServer = async () => {
  const app = express();

  ConnectWithDataBase();

  await App(app);

  app.listen(process.env.PORT, function () {
    console.clear();
    console.log("Server is Listening on port 8080!!");
  });
};

StartServer();
