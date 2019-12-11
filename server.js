const express = require('express');
const path = require('path');
const mongodb = require('mongodb');

const { port, connectionString } = require('./config');
const { passwordProtected } = require('./password')
const { sanitize } = require('./sanitize');

const app = express();
let db;

mongodb.connect(connectionString, 
  {useNewUrlParser: true, useUnifiedTopology: true}, 
  (err, client) => {
    db = client.db();
    app.listen(port);
});

app.set('views', './public');
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(passwordProtected);

app.get('/', (req, res) => {
  db.collection('todoItem').find().toArray((err, todoItem) => {
    items = todoItem.map(item => item);
    res.render('index', {items});
  });
});

app.post('/create-item', (req, res) => {
  const { text } = req.body;
  db.collection('todoItem').insertOne({ text: sanitize(text) }, (err, data) => res.json(data.ops[0]));
});

app.post('/update-item', (req, res) => {
  const { text, id } = req.body;

  db.collection('todoItem').findOneAndUpdate({_id: new mongodb.ObjectId(id)}, {$set: {text: sanitize(text)}}, () => res.send('Success'))
});

app.post('/delete-item', (req, res) => {
  const { id } = req.body;
  db.collection('todoItem').deleteOne({'_id': mongodb.ObjectId(id)}, () => res.send('Success'))
});
