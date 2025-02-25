const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, unique: true, required: true },
    customAlias: { type: String, unique: true, sparse: true },
    topic: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model("Url", urlSchema);