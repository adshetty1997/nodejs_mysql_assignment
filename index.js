import express from "express";
import dotenv from "dotenv";
dotenv.config();


import { userTypes } from "./constants";
import {auth,createToken,verifyPassword,encryptPassword, startLogging, logInfo} from "./helper.js";
import { checkTables, createEntry, createFeed, createUser, deleteEntryByFeedId, deleteEntryByUserId, deleteFeed, deleteUser, getEntriesByUserId, getFeedAccess, getFeedById, getFeeds, getFeedsById, getUser, getUserById, getUsers, updateEntries, updateFeed, updateUser } from "./db.js";
const app = express();

app.use((err, req, res, next) => {
    logInfo(`ERROR == ${err.message}`);
    res.status(400).send(err.message);
})

app.post("/login",async(req,res)=>{
    let {email,password} = req.body;
    let user = await getUser({email:email});
    if(!user || user.length===0){
        throw Error("User not found.");
    }
    let valid = verifyPassword(password,user.password);
    if(valid){
        let token = createToken({...user});
        res.status(201).send({data:{...user},token:token});
    }
    else if(!valid){
        throw Error("Invalid credentials.");
    }
});

app.use(auth);

app.post("/create-user",(req,res)=>{
    if(!req.role || req.role === userTypes.basic){
        throw Error("Only Admin or Super Admin can create users");
    }
    else{
        if(req.role === userTypes.super && req.body.role === userTypes.super){
            throw Error("Cannot create another super admin");
        }
        else if(req.role === userTypes.admin && req.body.role !== userTypes.basic){
            throw Error("CaAdmins can only create basic users.");
        }
        let data = {...req.body};
        createUser(data);
        res.status(201).send({message:"User Created"});
    }
});

app.get("/get-user/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    let user = await getUser({id:id});
    res.status(201).send({data:{...user}});
});

app.get("/get-users",async(req,res)=>{
    let users = await getUsers();
    res.status(201).send({data:[...users]});
});

app.post("/update-user/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    
    let user = await getUser({id:id});
    
    if(!user || user.length===0){
        throw Error("User not found.");
    }
    else if(!(req.role === userTypes.super || (req.role === userTypes.admin && user.role === userTypes.basic))){
        throw Error("You are not authorized to update this user.");
    }

    updateUser(req.body,id);

    res.status(201).send({data:{...user}});
});

app.delete("/delete-user/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    
    let user = await getUser({id:id});
    
    if(!user || user.length===0){
        throw Error("User not found.");
    }
    else if(!(req.role === userTypes.super || (req.role === userTypes.admin && user.role === userTypes.basic))){
        throw Error("You are not authorized to delete this user.");
    }

    deleteUser(id);
    deleteEntryByUserId(id);

    res.status(201).send({message:`User ${user.name||id} deleted`});
});

app.post("/create-feed",async(req,res)=>{
    if(!req.role || req.role !== userTypes.super){
        throw Error("Only Super Admin can create feeds");
    }
    let data = {...req.body};
    await createFeed(data);
    res.status(201).send({message:"Feed Created"});
});

app.get("/get-feed/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    let access = await getFeedAccess(id,req.id);
    if(!access || access.length===0){
        throw Error("You do not have access to this feed");
    }
    let feed = await getFeedById({id:id});
    res.status(201).send({data:{...feed}});
});

app.get("/get-feeds",async(req,res)=>{
    let feeds = [];
    if(req.role === userTypes.super){
        feeds = await getFeeds();
    }
    else{
        let idArray =await getEntriesByUserId(req.id);
        feeds = await getFeedsById(idArray);
    }
    res.status(201).send({data:{...feeds}});
});

app.post("/update-feed/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    if(req.role !== userTypes.super){
        throw Error("You do not have access to update this feed");
    }
    let feed = await updateFeed(req.body,id);
    res.status(201).send({data:{...feed}});
});

app.delete("/delete-feed/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){
        throw Error("No id provided");
    }
    
    let user = await getFeedById({id:id});
    let accessDetails = await getFeedAccess(id,req.id);
    
    if(!user || user.length===0){
        throw Error("Feed not found.");
    }
    else if(!(req.role === userTypes.super || (req.role === userTypes.admin && accessDetails.deletePermission))){
        throw Error("You are not authorized to delete this user.");
    }

    deleteFeed(id);
    deleteEntryByFeedId(id);

    res.status(201).send({message:`User ${user.name||id} deleted`});
});


app.post("/feed-access",(req,res)=>{
    let {userId,feedId,deletePermission} = req.body;

    if(req.role!==userTypes.admin){
        deletePermission = false;
    }
    
    createEntry({userId:userId,feedId:feedId,deletePermission:deletePermission});
    res.status(201).send({message:`Feed access granted`});
});

app.post("/update-feed-access/:feedId",async(req,res)=>{
    let {userId,deletePermission} = req.body;
    let feedId = req.params.feedId;

    if(req.role!==userTypes.super){
        deletePermission = false;
    }

    let user = await getUserById(userId);
    let feed = await getFeedById(feedId);
    let access = await getFeedAccess(feedId,userId);

    if(!user || user.length===0){
        throw Error("User does not exist.");
    }
    else if(!feed || feed.length===0){
        throw Error("Feed does not exist.");
    }
    else if(!access || access.length===0){
        throw Error("User does not have access to this feed.");
    }

    await updateEntries({userId:userId,deletePermission:deletePermission,feedId:feedId});
    res.status(201).send({message:`Updated`});
});


app.get("/get-logs",async(req,res)=>{
    if(req.role!==userTypes.super){
        throw Error("You are not authorized to view logs.");
    }
    let logs = await getLogs();
    
    res.status(201).send({logs:logs});
});

app.listen(8080,()=>{
    checkTables();
    let adminPassword = encryptPassword(process.env.SUPER_ADMIN_PASSWORD);
    createUser({email:"admin@assignment.co",name:"super admin",role:userTypes.super,password:adminPassword});
    startLogging();
    
    console.log("Server running on port 8080");
});