const express =require("express")
const cors =require('cors')
//const bodyParser = require('body-parser')
const Pool = require('pg').Pool 
var session =require('express-session')

const dbconnection = new Pool({
    host:"localhost",
    port:'5432',
    database:"coinbase",
    user:"coin_user",
    password:"coin999"
})
const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:true}));
server.set('trust proxy', 1) 
server.use(session(
    {
    secret: 'kdksdkammasmsm',
    resave: 'false',
    saveUninitialized: true,
    cookie: { secure: false }

    }
))
server.get("/user/session",async (req,res)=>{
    console.log(req.session)
    const  usdname= req.session.usd;
    const btcname=req.session.btc;
    const ngnname =req.session.ngn
    const data={"usd":usdname,"btcname":btcname,"ngn":ngnname}
    console.log(data)
    return res.json(data);
})
server.post ("/user/createsession",(req,res)=>{
    console.log(req.body)
    const usdname= req.body.usd;
    const btcname= req.body.btc;
    const ngnname= req.body.ngn;
    //console.log(name)
    req.session.usd= usdname;
    req.session.btc=btcname;
    req.session.ngn = ngnname;
    console.log(req.session)
    const data={"status":"ok","message":"successfully saved name "}
    res.json(data)

});


server.get("/get/coinbase", (req,res)=>{
    var data={}
    const query = "SELECT * FROM Coin"
    dbconnection.query(query,[],(error,result)=>{
        if (error){
            console.log(error)
            data={"status":"failed", "message":"unable to get databse"}
            return res.json(data);
         }
         console.log(result.rows)
         data={"status":"succesful", "message":"succesfull gotten databse", "coin":result.rows}
         res.json(data);
    })
})

server.post("/post/coinbase", (req,res)=>{
    var usd=req.body.usd
    var btc =req.body.btc
    var ngn =req.body.ngn

    var data = []
    const query= "INSERT INTO coin( usd, btc,ngn ) VALUES('"+usd+"','"+btc+"','"+ngn+"')"
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

server.listen(5001,()=>{
    console.log("Server Started")
})