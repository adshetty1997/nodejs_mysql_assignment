import mysql from "mysql2";
import { logInfo } from "./helper";

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise();

export const checkTables = async() => {
    let tablesList = (await pool.query("SHOW TABLES"))[0].map(x=>Object.values(x)[0]);
    if(!tablesList.find(x=>x==="users")){
        createUserTable();
    }
    //create super admin
    if(!tablesList.find(x=>x==="feeds")){
        createFeedTable();
    }
    //add initial feeds
    if(!tablesList.find(x=>x==="allowedfeeds")){
        createAllowedFeedsTable();
    }
}

// --------------------------------USER-----------------------------------------------------

export const createUserTable = async()=> {
    await pool.query(
        "CREATE TABLE users (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,name varchar(255),role varchar(20),email varchar(255),password varchar(255))"
        );
}

export const createUser = async(data)=> {
    let {email,name,role,password} = data;
    await pool.query(
        "INSERT INTO users (name, role, email, password) VALUES (?,?,?,?)",[name, role, email, password]
        );
    logInfo(`User ${name} created.`);
}

export const getUserById = async(id)=> {
    let res = await pool.query(
    "SELECT *  FROM users WHERE id = ?",[id]
    );
    return res[0];
}

export const getUsers = async() => {
    let res = await pool.query(
        "SELECT *  FROM users "
        );
    return res[0];
}

export const updateUser = async(updateObj,userId)=> {
    let updateStatement = "";
    let params = [];
    Object.keys(updateObj).map((x,i)=>{
        updateStatement = updateStatement + (i>0?",":"") + `${x} = ? `;
        params.push(updateObj[`${x}`]);
    });

    await pool.query(
        "UPDATE user SET "+updateStatement+" WHERE id = ?",[...params,userId]
        );
    logInfo(`User ${userId} updated.`);
}

export const deleteUser = async(id)=> {
    await pool.query(
        "DELETE FROM users WHERE id = ?",[id]
        );
    logInfo(`User ${id} deleted.`);
}

// --------------------------------FEED-----------------------------------------------------

export const createFeedTable = async()=> {
    await pool.query(
        "CREATE TABLE feeds (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,name varchar(255),url varchar(255),description varchar(255))"
        );
}

export const createFeed = async(data)=> {
    let {name, url, description} = data;
    await pool.query(
        "INSERT INTO feeds (name, url, description) VALUES (?,?,?)",[name, url, description]
        );
    logInfo(`Feed ${name} created.`);
}

export const getFeedById = async(id)=> {
    let res = await pool.query(
    "SELECT *  FROM users WHERE id = ?",[id]
    );
    return res[0];
}

export const getFeedsById = async(idArray)=> {
    let res = await pool.query(
    "SELECT *  FROM users WHERE id IN ("+idArray.join(",")+")"
    );
    return res[0];
}

export const getFeeds = async() => {
    let res = await pool.query(
        "SELECT *  FROM users "
        );
    return res[0];
}

export const updateFeed = async(updateObj,feedId)=> {
    let updateStatement = "";
    let params = [];
    Object.keys(updateObj).map((x,i)=>{
        updateStatement = updateStatement + (i>0?",":"") + `${x} = ? `;
        params.push(updateObj[`${x}`]);
    });

    await pool.query(
        "UPDATE feed SET "+updateStatement+" WHERE id = ?",[...params,feedId]
        );
    logInfo(`Feed ${feedId} updated.`);
}

export const deleteFeed = async(id)=> {
    await pool.query(
        "DELETE FROM feeds WHERE id = ?",[id]
        );
    logInfo(`Feed ${id} deleted.`);
}

// --------------------------------ALLOWED FEED-----------------------------------------------------

export const createAllowedFeedsTable = async()=> {
    await pool.query(
        "CREATE TABLE allowedfeeds (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,userId int,feedId int,deletePermission boolean)"
        );
}

export const createEntry= async(data)=> {
    let {userId, feedId, deletePermission} = data;
    await pool.query(
        "INSERT INTO feeds (userId, feedId, deletePermission) VALUES (?,?,?)",[userId, feedId, deletePermission||false]
        );
    logInfo(`User ${userId} granted access to feed ${feedId}.`);
}

export const getEntriesByUserId = async(userId)=> {
    let res = await pool.query(
        "SELECT feedId  FROM allowedfeeds  WHERE userId = ?",[userId]
        );
    return res[0];
}

export const getEntriesByFeedId= async(feedId)=> {
    let res = await pool.query(
        "SELECT *  FROM allowedfeeds  WHERE feedId = ?",[feedId]
        );
    return res[0];
}

export const getFeedAccess= async(feedId,userId)=> {
    let res = await pool.query(
        "SELECT *  FROM allowedfeeds  WHERE feedId = ? AND userId = ?",[feedId,userId]
        );
    return res[0];
}

export const updateEntries = async(queryObject)=> {
    let {userId,feedId,deletePermission} = queryObject;
    await pool.query(
        "UPDATE allowedfeeds SET deletePermission = ? WHERE userId = ? AND feedId = ?",[deletePermission,userId,feedId]
        );
    logInfo(`User ${userId} access to feed ${feedId} updated.`);
}

export const deleteEntryByUserId = async(userId)=> {
    await pool.query(
        "DELETE FROM allowedfeeds WHERE userId = ?",[userId]
        );
}

export const deleteEntryByFeedId = async(feedId)=> {
    await pool.query(
        "DELETE FROM allowedfeeds WHERE feedId = ?",[feedId]
        );
}