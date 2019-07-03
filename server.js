const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'xianzhe',
    database : 'smartbrain_final'
  }
});

db.select('*').from('login').then(data => {
  console.log(data);
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
/*app.post('/register', (req, res) => { 
  const { email, name, password} = req.body;
  db('users')
  .returning('*')
  .insert({
    email: email,
    name: name,
    joined: new Date()
  })
  .then(user => {
    res.json(user[0]);
  })
  .catch(err => res.status(404).json('unable to register'))
 })
*/

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})
