const express = require('express');
const cookieParser = require('cookie-parser');
import {Response, Request} from "express";
require('global-agent/bootstrap');
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://172.31.2.3:8080';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response)=>{
    res.send("server running");
})

const auth = require("./routes/auth.route");
app.use("/auth", auth);
const product = require("./routes/product.route");
app.use("/product", product);
const profile = require("./routes/profile.route");
app.use("/profile", profile);
const cart = require("./routes/cart.route");
app.use("/cart", cart);

app.listen(5000, ()=>{
    console.log("server running on port 5000");
});