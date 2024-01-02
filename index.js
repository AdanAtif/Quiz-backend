const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const authRoutes = require("./src/routes/authRoutes.js");
const quizRoutes = require("./src/routes/quizRoutes.js");
const questionRoutes = require("./src/routes/questionRoutes.js");
const userRoutes = require("./src/routes/userRoutes.js")


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/question", questionRoutes);
app.use("/user", userRoutes);
app.get('/',(req,res)=>{
  res.send('Hello')
})

app.listen(process.env.Port);
