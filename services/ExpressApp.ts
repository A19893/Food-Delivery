import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRouter, VendorRouter } from "../routes";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.dev" });


export default async(app:Application)=>{
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('uploads', express.static("uploads"));


app.use("/admin", AdminRouter);
app.use("/vendor", VendorRouter);

return app;
}

