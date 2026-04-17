const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const BOT_TOKEN = "PASTE_TOKEN";
const CHAT_ID = "PASTE_CHAT_ID";

app.post("/webhook", async (req,res)=>{

let msg = req.body.message?.text;

if(msg == "/startdraw"){

let num = Math.floor(Math.random()*16);
let amt = (num+1)*1000;

await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
chat_id:CHAT_ID,
text:`🎯 Result: ${num} | ₹${amt}`
})
});

}

res.send("ok");

});

app.listen(3000,()=>console.log("Running"));
