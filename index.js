var express = require('express');
var app = express();
const path = require('path');
app.use(express.static(__dirname + '/views/static'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
var highscore = 1;
var userName = "Computer";

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/game.html'));
});

app.post('/highscore', function(req, res) {
  if (highscore < Number(req.body.score) + 1) {
    highscore = Number(req.body.score) + 1
    userName = req.body.userName
    console.log("New Highscore by: " + userName)
  }
  return true
})

app.get('/highscore', function (req, res) {
  res.json({ 
    userName:userName,
    highscore: highscore })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});