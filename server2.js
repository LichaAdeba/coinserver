const express =require("express")
const cors =require('cors')
//const bodyParser = require('body-parser')
const Pool = require('pg').Pool 
const bcrypt = require('bcrypt');

const dbconnection = new Pool({
    host:"localhost",
    port:'5432',
    database:"getcoininfo",
    user:"coininfo_user",
    password:"coininfo_999"
})
const server = express()
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:true}));

server.post("/v1/auth", async (req,res)=>{
    var email=req.body.email
    var password = req.body.password
    var salt = await bcrypt.genSalt(10)
    
    var data={}
    const query = "SELECT * FROM users where email ='"+email+"'"
    dbconnection.query(query,[], async (error,result)=>{
        if (error){
            console.log(error)
            data={"status":"failed", "message":"unable to log in"}
            return res.json(data);
         }
        if(result.rows.length >= 1){
            const hashedpassword=result.rows[0].password;
            var isvalid = await bcrypt.compare(password,hashedpassword);
            if(isvalid){
                console.log(result.rows)
                data={"status":"succesful", "message":"succesfull Logged in"}
            }else{
                console.log(result.rows)
                data={"status":"failed", "message":"invalid user"}
            }
            
         }else{
            console.log(result.rows)
            data={"status":"failed", "message":"invalid user"}
         }
    
         res.json(data);
    })
})

server.post("/v1/create/user", async (req,res)=>{
    var email=req.body.email
    var password =req.body.password
    var salt = await bcrypt.genSalt(10)
    var hashedpassword = await bcrypt.hash(password,salt);

    var data = []
    const query= "INSERT INTO users(email, password) VALUES('"+email+"','"+hashedpassword+"')"
    dbconnection.query(query,[],(error,result)=>{
        if(error){
            console.log(error)
            data={"status":"failed", "message":"unable to get databse"}
            return res.json(data);
        }
        console.log(result.rows)
        data={"status":"succesful", "message":"succesfull gotten databse"}
        res.json(data);
    })
    
})
server.get("/v1/session",async (req,res)=>{
    console.log(req.session)
    const  emailname= req.session.email;
    const passwordname=req.session.password;
    const data={"email":emailname,"password":passwordname}
    console.log(data)
    return res.json(data);
})
server.post ("/v1/createsession",(req,res)=>{
    console.log(req.body)
    const emailname= req.body.email;
    const passwordname= req.body.password;
    //console.log(name)
    req.session.email= emailname;
    req.session.password=passwordname;
    console.log(req.session)
    const data={"status":"ok","message":"successfully saved name "}
    res.json(data)

});

server.listen(5003,()=>{
    console.log("Server Started")
})