const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');  
const Alumni = require('./models/alumni');
const config = require('./config');

const app = express();
const port = process.env.port || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'natsIsSoCoolOmgLmaoYouHaveNoClue',  
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const dbUrl = config.mongoURL;
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

app.get('/', async (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/registration', async (req, res) => {
  try {
    res.render('register');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    res.render('dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/alumni/register', async (req, res) => {
  const {
    username,
    password,
    name,
    graduationYear,
    contactNumber,
    email,
    currentJob,
  } = req.body;

  try {
    const highestalumniID = await Alumni.findOne({}, {}, { sort: { alumniID: -1 } });

    const newAlumni = new Alumni({
      username,
      name,
      graduationYear,
      contactNumber,
      email,
      currentJob,
      alumniID: highestalumniID ? highestalumniID.alumniID + 1 : 1,
    });

    console.log(newAlumni);

    await Alumni.register(newAlumni, password);

    res.status(201).json({
      username: newAlumni.username,
      name: name,
      graduationYear: newAlumni.graduationYear,
      contactNumber: newAlumni.contactNumber,
      email: newAlumni.email,
      currentJob: newAlumni.currentJob,
      alumniID: newAlumni.alumniID,
    });
  } catch (error) {
    console.error('Error registering alumni:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/alumni/login', passport.authenticate('local'), async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      name: req.user.name,
      graduationYear: req.user.graduationYear,
      contactNumber: req.user.contactNumber,
      email: req.user.email,
      currentJob: req.user.currentJob,
    });
  } catch (error) {
    console.error('Error during alumni login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/alumni/update/', async (req, res) => {
  const data = req.body;

  try {
    const alumniID = data.alumniID;
    const alumni = await Alumni.findOne({ alumniID });

    if (!alumni) {
      res.status(404).send('Alumni not found');
      return;
    }

    if (data.newUsername !== undefined && data.newUsername !== '') {
      alumni.username = data.newUsername;
    }
    if (data.name !== undefined && data.name !== '') {
      alumni.name = data.name;
    }
    if (data.graduationYear !== undefined && data.graduationYear !== '') {
      alumni.graduationYear = data.graduationYear;
    }
    if (data.contactNumber !== undefined && data.contactNumber !== '') {
      alumni.contactNumber = data.contactNumber;
    }
    if (data.email !== undefined && data.email !== '') {
      alumni.email = data.email;
    }
    if (data.currentJob !== undefined && data.currentJob !== '') {
      alumni.currentJob = data.currentJob;
    }

    await alumni.save();

    res.status(200).json({
      id: alumni._id,
      username: alumni.username,
      name: alumni.name,
      graduationYear: alumni.graduationYear,
      contactNumber: alumni.contactNumber,
      email: alumni.email,
      currentJob: alumni.currentJob
    });

  } catch (error) {
    console.error('Error during alumni updation:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/alumni/resetpass', async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const alumniID = data.alumniID;
    const alumni = await Alumni.findOne({ alumniID });

    if (!alumni) {
      res.status(404).send('Alumni not found');
      return;
    }

    if (!alumni.authenticate(data.currentPassword)) {
      res.status(401).send('Incorrect current password');
      return;
    }

    const deletedAlumni = await Alumni.findOneAndDelete({ alumniID });

    console.log("deleted")
    console.log(alumni);

    const username = alumni.username;
    const name = alumni.name;
    const graduationYear = alumni.graduationYear;
    const contactNumber = alumni.contactNumber;
    const email = alumni.email;
    const currentJob = alumni.currentJob;

    const newAlumni = new Alumni({
      username,
      name,
      graduationYear,
      contactNumber,
      email,
      currentJob,
      alumniID,
    });

    console.log(newAlumni);

    await Alumni.register(newAlumni, data.newPassword);

    res.status(200).json({
      id: newAlumni._id,
      username: newAlumni.username,
      name: newAlumni.name,
      graduationYear: newAlumni.graduationYear,
      contactNumber: newAlumni.contactNumber,
      email: newAlumni.email,
      currentJob: newAlumni.currentJob,
      alumniID: newAlumni.alumniID,
    });


  } catch (error) {
    console.error('Error during password updation:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/alumni/delete/', async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const alumniID = data.alumniID;
    console.log(alumniID);
    const deletedAlumni = await Alumni.findOneAndDelete({ alumniID });

    if (!deletedAlumni) {
      res.status(404).send('Alumni not found');
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error during alumni deactivation:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/alumni/all', async (req, res) => {
  try {
    const alumniProfiles = await Alumni.find({}, 'alumniID name graduationYear currentJob');
    res.status(200).json(alumniProfiles);
  } catch (error) {
    console.error('Error while fetching alumni profiles:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});