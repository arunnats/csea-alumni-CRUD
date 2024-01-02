const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const bodyParser = require('body-parser');
const Alumni = require('./models/alumni');
const config = require('./config');

const app = express();
const port = process.env.port || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbUrl = 'config.mongoURL'; 
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

passport.use(new LocalStrategy(Alumni.authenticate()));
passport.serializeUser(Alumni.serializeUser());
passport.deserializeUser(Alumni.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// Alumni Registration (Create - POST)
app.post('/api/alumni/register', async (req, res) => {
  });
  
// Alumni Login (Read - GET)
app.get('/api/alumni/login', passport.authenticate('local'), (req, res) => {
    
});

// Alumni Profile Update (Update - PUT)
app.put('/api/alumni/update/:alumniId', async (req, res) => {

});

// Alumni Deactivation (Delete - DELETE)
app.delete('/api/alumni/delete/:alumniId', async (req, res) => {

});

// View Alumni Profiles (Read - GET)
app.get('/api/alumni/all', async (req, res) => {

});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});