const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Alumni = require('./models/alumni');
const config = require('./config');

const app = express();
const port = 3000;

// Connect to MongoDB Atlas
const dbUrl = config.mongoURL;
mongoose.connect('dbUrl', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up sessions and passport
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Alumni.authenticate()));
passport.serializeUser(Alumni.serializeUser());
passport.deserializeUser(Alumni.deserializeUser());

// Alumni Registration (Create - POST)
app.post('/api/alumni/register', async (req, res) => {
  try {
    const alumni = new Alumni(req.body);
    await Alumni.register(alumni, req.body.password);
    res.status(201).json({
      id: alumni._id,
      username: alumni.username,
      name: alumni.name,
      graduationYear: alumni.graduationYear,
      contactNumber: alumni.contactNumber,
      email: alumni.email,
      currentJob: alumni.currentJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Alumni Login (Read - GET)
app.post('/api/alumni/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    name: req.user.name,
    graduationYear: req.user.graduationYear,
    contactNumber: req.user.contactNumber,
    email: req.user.email,
    currentJob: req.user.currentJob
  });
});

// Alumni Profile Update (Update - PUT)
app.put('/api/alumni/update/:alumniId', async (req, res) => {
  const { alumniId } = req.params;
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(alumniId, req.body, { new: true });
    res.status(200).json({
      id: updatedAlumni._id,
      username: updatedAlumni.username,
      name: updatedAlumni.name,
      graduationYear: updatedAlumni.graduationYear,
      contactNumber: updatedAlumni.contactNumber,
      email: updatedAlumni.email,
      currentJob: updatedAlumni.currentJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Alumni Deactivation (Delete - DELETE)
app.delete('/api/alumni/delete/:alumniId', async (req, res) => {
  const { alumniId } = req.params;
  try {
    await Alumni.findByIdAndDelete(alumniId);
    req.logout();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// View Alumni Profiles (Read - GET)
app.get('/api/alumni/all', async (req, res) => {
  try {
    const allAlumni = await Alumni.find({}, { _id: 1, username: 1, name: 1, graduationYear: 1, contactNumber: 1, email: 1, currentJob: 1 });
    res.status(200).json(allAlumni);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
