const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required:[true,"Please Add Name"]
  },
  content: [String]
});

module.exports =  mongoose.model("list",contentSchema);
