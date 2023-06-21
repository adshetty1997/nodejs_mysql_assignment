import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise();

const checkTables = async() => {
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

checkTables();

// --------------------------------USER-----------------------------------------------------

const createUserTable = async()=> {
    await pool.query(
        "CREATE TABLE users (id varchar(15),name varchar(255),role varchar(20),email varchar(255),password varchar(255))"
        );
}

const createUser = async()=> {

}

const getUser = async()=> {

}

const updateUser = async()=> {

}

const deleteUser = async()=> {

}

// --------------------------------FEED-----------------------------------------------------

const createFeedTable = async()=> {
    await pool.query(
        "CREATE TABLE feeds (id varchar(15),name varchar(255),url varchar(255),description varchar(255))"
        );
}

const createFeed = async()=> {

}

const getFeed = async()=> {

}

const updateFeed = async()=> {

}

const deleteFeed = async()=> {

}

// --------------------------------ALLOWED FEED-----------------------------------------------------

const createAllowedFeedsTable = async()=> {
    await pool.query(
        "CREATE TABLE allowedfeeds (id varchar(15),userId varchar(15),feedId varchar(15),deletePermission boolean)"
        );
}

const createEntry= async()=> {
    
}

const getEntries = async()=> {
    
}

const updateEntries = async()=> {
    
}

const deleteEntries = async()=> {
    
}