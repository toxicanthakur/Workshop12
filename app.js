const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("./userschema");
mongoose.connect(process.env.URI, () => {
  console.log("DATABASE CONNECTED");
});
app.get("/", (req, res) => {
  res.send("server running");
});
app.get("/find-user", async (req, res) => {
  const { skip, limit, name } = req.query;
  console.log(req.query);

  //get data by full name by find method
  //const userData = await userModel.find({ name: name }).sort({ name: 1 }); //.limit(parseInt(limit)).skip(parseInt(skip))

  //using aggregation query
  const userData = await userModel.aggregate([
    { $match: { name: { $regex: name, $options: "i" } } },
    { $sort: { name: 1 } },
   // { $skip: (parseInt(skip))},
   // { $limit:(parseInt(limit)) },
  //   { $project: { _id: 0, name: 1, password: 0 } },
   ]);

  //manual pagination
  const startIndex = (Number(skip) - 1) * Number(limit);
  const endIndex = Number(skip) * Number(limit);
  const pagenatedData = userData.slice(startIndex, endIndex);
  res.json(pagenatedData);
});
app.listen(5000);
