require('dotenv').config();
const express = require('express');
const session = require('express-session');
const messagesCtrl = releaseEventsquire('./messagesCtrl');

let {SERVER_PORT, SESSION_SECRET} = process.env;

const app = express();

app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use((req, res, next) => {
    let badWords = ['butts', 'poop', 'farts'];
    if (req.body.message) {
      for (let i = 0; i < badWords.length; i++) {
        let regex = new RegExp(badWords[i], 'g');
        req.body.message = req.body.message.replace(regex, '****');
      }
      next();
    } else {
      next();
    }
  });

app.get('/api/messages', messagesCtrl.getAllMessages);
app.get('api/messages/history', messagesCtrl.history)
app.post('api/message', messagesCtrl.createMessage);

app.listen(SERVER_PORT, () => {
    console.log('server listening on port ${SERVER_PORT}');
});