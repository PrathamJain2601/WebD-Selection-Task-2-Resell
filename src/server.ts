const express = require('express');
import {Response, Request, urlencoded} from "express";
require('global-agent/bootstrap');
process.env.GLOBAL_AGENT_HTTP_PROXY = 'http://172.31.2.3:8080';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response)=>{
    res.send("server running");
})

const auth = require("./routes/auth.route");
app.use("/auth", auth);

app.listen(5000, ()=>{
    console.log("server running on port 5000");
});