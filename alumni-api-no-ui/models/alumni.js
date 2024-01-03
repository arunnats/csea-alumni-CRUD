const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const alumniSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  graduationYear: Number,
  contactNumber: String,
  email: String,
  currentJob: String,
  alumniID: { type: Number, unique: true, required: true }, 
});

alumniSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Alumni', alumniSchema);
