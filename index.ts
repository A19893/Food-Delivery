import express from "express";
import { AdminRouter,VendorRouter } from "./routes";
const app = express();

app.use('/admin',AdminRouter);
app.use('/vendor',VendorRouter);

app.listen(8080,function(){
    console.log("Server is Listening on port 8080!!")
})