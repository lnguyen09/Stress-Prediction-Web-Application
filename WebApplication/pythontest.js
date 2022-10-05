const express = require('express')
const app = express()
app.set('view engine', 'pug')
app.set('views', __dirname + '/views');

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded()); 
const port = 3001

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/result', (req, res) =>{
  let {PythonShell} = require('python-shell')
  // console.log(typeof req.body.type)
  let body = JSON.stringify(req.body.type)
  

  let pyshell = new PythonShell('python.py');
  pyshell.send(body);
  body = "Your input is: " + body

  // sends a message to the Python script via stdin
  pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)

    if(message.includes('No')){
      message = "Your result is: " + message
      const details = {
        title: "No Stress",
        message2: message.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '')
      }

      res.render('index', details)
      // res.redirect('/nostress')
    }else{
      message = "Your result is: " + message
      const details = {
        title: "Stress",
        message2: message.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '')
      }

      res.render('index', details)
      // res.redirect('/stress')
    }
  })

  // pyshell.end(function (err,code,signal) {
  //     if (err) print(err);
  //     console.log('The exit code was: ' + code);
  //     console.log('The exit signal was: ' + signal);
  //     console.log('finished');
  // });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('*', (req, res) => {
  res.send({
    "message": "404 not found"
  })
})



// let {PythonShell} = require('python-shell')

// let pyshell = new PythonShell('python.py');
// pyshell.send('I feel stress');

// // sends a message to the Python script via stdin
// pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log(message);
// });

// pyshell.end(function (err,code,signal) {
//     if (err) print(err);
//     console.log('The exit code was: ' + code);
//     console.log('The exit signal was: ' + signal);
//     console.log('finished');
//   });