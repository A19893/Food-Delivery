import express from "express";
import bodyParser from "body-parser";
import { AdminRouter, VendorRouter } from "./routes";
import dotenv from "dotenv";
import { connectWithDatabase } from "./config";
import path from 'path'

dotenv.config({ path: "./.env.dev" });

const app = express();

connectWithDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('uploads', express.static("uploads"));


app.use("/admin", AdminRouter);
app.use("/vendor", VendorRouter);

app.listen(process.env.PORT, function () {
  console.clear(); 
  console.log("Server is Listening on port 8080!!");
});
