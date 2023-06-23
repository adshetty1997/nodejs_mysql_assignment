import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from 'fs';

let currentFile = `${Date.now().toString()}.txt`;
let filePath = "./logs/"
let writeStream = fs.createWriteStream(filePath+currentFile);

export const encryptPassword = async(password)=>{
    let encrypted = await bcrypt.hash(password,process.env.ENCRYPTION_ROUNDS);
    return encrypted;
}

export const verifyPassword = async(password,hash)=>{
    let decrypted = await bcrypt.compare(password,hash);
    return decrypted;
}

export const createToken = (payload)=>{
    let token = jwt.sign(payload,process.env.TOKEN_SECRET_KEY);
    return token;
}

export const auth = (req,res,next)=>{
    try{
        let token = req.headers.authorization;
        if(token){
            let decoded = jwt.verify(token,process.env.TOKEN_SECRET_KEY);
            req = {...req,...decoded};
        }
        else{
            res.status(401).json({message:"You are not Authorized to request this API"});
        }
        next();
    }
    catch(error){
        res.status(401).json({message:"Error Authorizing this user"});
    }
}

export const logInfo = (message) => {
    writeStream.write(`${Date.now()} : `+message+"\n");
}

export const getLogs = async() => {
    try {
        const data = await fs.readFile((filePath+currentFile), { encoding: 'utf8' });
        return data;
      } catch (err) {
        throw(err);
      }
}

export const startLogging = () => {
    setInterval(()=>{
        // create new File
        currentFile = `${Date.now().toString()}.txt`;
        writeStream = fs.createWriteStream(filePath+currentFile);

        // delete older files
        fs.readdir("./logs", (err, files) => {
            files.forEach(file => {
              let timeStamp = (Number)(file.split(".")[0]);
              let checkTimeStamp = Date.now() - process.env.DELETE_FILE_TIME;
              if((timeStamp - checkTimeStamp)<0){
                fs.rm(file);
              }
            });
          });
    },process.env.NEW_FILE_TIME);
}
