import express from "express";

const app = express();

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get("/",(req,res)=>{
    
});

app.listen(8080,()=>{
    console.log("Server running on port 8080");
});