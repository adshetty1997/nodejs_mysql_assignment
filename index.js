import express from "express";
import dotenv from "dotenv";
dotenv.config();

import {auth} from "./helper.js";
import { checkTables } from "./db.js";

const app = express();

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get("/login",(req,res)=>{
    
});

app.use(auth);

app.get("/create-user",(req,res)=>{
    
});

app.get("/get-user/:id",(req,res)=>{
    
});

app.get("/get-users",(req,res)=>{
    
});

app.get("/update-user/:id",(req,res)=>{
    
});

app.get("/delete-user/:id",(req,res)=>{
    
});

app.get("/create-feed",(req,res)=>{
    
});

app.get("/get-feed/:id",(req,res)=>{
    
});

app.get("/get-feeds",(req,res)=>{
    
});

app.get("/update-feed/:id",(req,res)=>{
    
});

app.get("/delete-feed/:id",(req,res)=>{
    
});

app.listen(8080,()=>{
    console.log("Server running on port 8080");
    checkTables();
});