const express =require("express")
const cors =require('cors')
//const bodyParser = require('body-parser')
const Pool = require('pg').Pool 

const dbconnection = new Pool({
    host:"localhost",
    port:'5432',
    database:"k1db",
    user:"k1user",
    password:"k1password"
})
const server = express()


server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:true}));

server.post('/v1/auth', (req,res)=>{
    var users=req.body.users


    var data={}
    const query = "SELECT * FROM username where users ='"+users+"'"
    dbconnection.query(query,[],(error,result)=>{
        if (error){
            console.log(error)
            data={"status":"failed", "message":"unable to log in"}
            return res.json(data);
         }
        if(result.rows.length >= 1){
            console.log(result.rows)
            data={"status":"succesful", "message":"succesfull Logged in"}
         }else{
            console.log(result.rows)
            data={"status":"failed", "message":"invalid user"}
         }
    
         res.json(data);
    })
})
server.post('/v1/create/username', (req, res)=>{
    var users=req.body.users



    var data = []

    const query= "INSERT INTO username(users) VALUES('"+users+"')"
    console.log(users)
    console.log(query)
    dbconnection.query(query,[],(error,result)=>{
        if(error){
            console.log(error)
            data={"status":"failed", "message":"unable to get databse"}
            return res.json(data);
        }
        console.log(data)
        console.log(result.rows)
        data={"status":"succesful", "message":"succesfull gotten databse"}
        res.json(data);

    })
})
server.listen(5004,()=>{
    console.log("Server Started")
})