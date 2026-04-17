 const express = require("express");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

/* 🔴 TELEGRAM */
const BOT_TOKEN = "PASTE_BOT_TOKEN";
const CHAT_ID = "6639328897";

/* 🔴 FIREBASE SERVICE KEY */
const serviceAccount = {
  "type": "service_account",
  "project_id": "PASTE",
  "private_key_id": "PASTE",
  "private_key": "PASTE",
  "client_email": "PASTE",
  "client_id": "PASTE"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "PASTE_DATABASE_URL"
});

const db = admin.database();

/* 🌐 WEBSITE */
app.get("/", (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Final Lucky Draw</title>
<style>
body{background:#020617;color:white;text-align:center;font-family:Arial}
.box{margin:10px;padding:10px;background:#0f172a;border-radius:10px}
.num{display:inline-block;padding:10px;margin:4px;background:#1e293b}
.light{background:yellow;color:black}
</style>
</head>
<body>

<h2>⚡ Final Lucky Draw</h2>

<div class="box">
<h2 id="timer">Waiting...</h2>
<h1 id="result">Locked</h1>
</div>

<div id="nums"></div>

<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

<script>
const firebaseConfig={
apiKey:"PASTE",
authDomain:"PASTE",
databaseURL:"PASTE",
projectId:"PASTE"
};

firebase.initializeApp(firebaseConfig);
const db=firebase.database();

/* NUMBERS */
let box=document.getElementById("nums");
for(let i=0;i<=15;i++){
let d=document.createElement("div");
d.innerText=i;
d.className="num";
box.appendChild(d);
}

/* LISTENER */
db.ref("draw").on("value",(snap)=>{
let d=snap.val();
if(!d)return;

let t=d.time;

let c=setInterval(()=>{
timer.innerText="⏳ "+t;
t--;

if(t<0){
clearInterval(c);

let all=document.querySelectorAll(".num");
all.forEach(n=>n.classList.remove("light"));

all[d.number].classList.add("light");

result.innerText="🎯 "+d.number+" | ₹"+d.amount;
}
},1000);
});
</script>

</body>
</html>
`);
});

/* 🤖 TELEGRAM CONTROL */
app.post("/webhook", async (req,res)=>{

let msg = req.body.message?.text;

if(msg == "/startdraw"){

let num = Math.floor(Math.random()*16);
let amt = (num+1)*1000;

/* FIREBASE UPDATE */
await db.ref("draw").set({
number:num,
amount:amt,
time:10
});

/* TELEGRAM MESSAGE */
await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
chat_id:CHAT_ID,
text:\`🎯 RESULT\nNumber: \${num}\nAmount: ₹\${amt}\`
})
});

}

res.send("ok");
});

/* START SERVER */
app.listen(3000,()=>console.log("Server Running"));
