const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])


const dbURI2 = process.env.DATABASE_CONNECTIONSTRING;
console.log("Database URI:", dbURI2);
  
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI2);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = connectDB;
