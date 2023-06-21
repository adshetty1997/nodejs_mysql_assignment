import mysql from "mysql2";

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
        "CREATE TABLE users (id varchar(15),name varchar(255),role varchar(20),email varchar(255),password varchar(255))"
        );
}

export const createUser = async()=> {

}

export const getUser = async()=> {

}

export const updateUser = async()=> {

}

export const deleteUser = async()=> {

}

// --------------------------------FEED-----------------------------------------------------

export const createFeedTable = async()=> {
    await pool.query(
        "CREATE TABLE feeds (id varchar(15),name varchar(255),url varchar(255),description varchar(255))"
        );
}

export const createFeed = async()=> {

}

export const getFeed = async()=> {

}

export const updateFeed = async()=> {

}

export const deleteFeed = async()=> {

}

// --------------------------------ALLOWED FEED-----------------------------------------------------

export const createAllowedFeedsTable = async()=> {
    await pool.query(
        "CREATE TABLE allowedfeeds (id varchar(15),userId varchar(15),feedId varchar(15),deletePermission boolean)"
        );
}

export const createEntry= async()=> {
    
}

export const getEntries = async()=> {
    
}

export const updateEntries = async()=> {
    
}

export const deleteEntries = async()=> {
    
}