require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const auth = require('./controllers/auth');
const jobs = require('./controllers/jobs');
const applications = require('./controllers/applications');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on', PORT));