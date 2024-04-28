const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const DB = "mongodb+srv://saurabhrajput30072002:VRwbBMSIuP5dkngg@bitbot.yjqv9vv.mongodb.net/bitbot-Data?retryWrites=true&w=majority&appName=bitbot"

mongoose.connect(DB,{useUnifiedTopology:true,
useNewUrlParser:true}).then(()=>console.log("database connected")).catch((error)=>{console.log(error);})
