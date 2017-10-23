const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
// to run locally: if process.env.PORT does not exist, port is set to 3000 instead
let app = express();
// express doesn't need arguments, only need to call express as a function and do configuration later

app.set('view engine', 'hbs');
// '.set' allows setting of express-related configuration settings. Takes name, value arguments. Special names found here: http://expressjs.com/en/api.html#app.settings.table



app.use((req, res, next) => {
  // next is used to say when you want function to be finished
  // without calling next(), none of the requests after function will run.
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  // list of request info: http://expressjs.com/en/4x/api.html#req
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs',{
//
//   });
// });
// // this app.use doesn't have a next(), so maintenance page gets called for every item in the directory

app.use(express.static(__dirname + '/public'));
// '.use()' takes desired middleware as arguments.
// 'static()' takes absolute path to folder you want to serve. __dirname stores path to your project folder

hbs.registerPartials(__dirname + '/views/partials');
// setting up a partial: reusable code (i.e. header, footer) that will appear on multiple pages. Usually lives in the views/partials directory.

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
// setting up a Helper function so date calculation doesn't need to take place here, it can take place in each of the other relvant .hbs files.


hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
// helpers can return functions


// Make home.hbs. Same h1, same footer, new welcome message
app.get('/', (req, res) => {
  // res.send('About Page');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    // currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome to the home page!'
  });
});


/*

app.get('/', (req, res) => {
  //res.send('<h1>Hello Express!</h1>');
  res.send({
    name: 'Alex',
    likes: [
      'thingOne',
      'thingTwo'
    ]
  });
  // Express automatically sets the data type to application/JSON
});
// '.get' takes 2 arguments: root and function. Root is just '/' here because actions are taking place on local machine.
// function arguments need to be req (request) and res (response).

*/

app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page'
    // currentYear: new Date().getFullYear()
  });
});
// .render allows you to render any of the files you have set up through current view engine. Takes 2 arguments, page to render and an object. Object would be used so that information injection doesn't need to take place in hbs file
// '.get' can be used to make as many routes as desired


// create /project.hbs, render header + footer. New link in home page. Commit to GitHub, commit to Heroku remote
app.get('/projects', (req, res) => {
  res.render('project.hbs', {
    pageTitle: 'Projects'
  });
});


app.get('/bad', (req, res) => {
  res.send({
    error: 'Unable to handle request'
    // status: 'Bad gateway'
  });
});

app.listen(port, () => {
  // to deploy on Heroku, port needs to be dynamic (Heroku will tell app which port to use)
  console.log(`Server is up on Port ${port}`);
});
// binds app to port on machine. Never 'finishes' executing,
// also takes a function as 2nd argument





/*
nodemon won't look for changes in handlebars code by default, so use the **-e** command in cmd to pass in arguments for other extensions to monitor.

**nodemon server.js -e js,hbs**



**git init** from project directory will create a .git folder inside
Have to tell git what files to keep track of
Commands:
**git status**
Witout configuration, will return file list as 'untracked files'
of 'node_modules, package.json, public/, server.js. server.log, views/', only need package.json, public/ server.js, views/
**git add fileName**
**git add .** will add all modified files in directory to tracked
=> **git add package.json**

.gitignore file takes file and/or directory names as plain text, separated by line, and tells git which files not to update. Then use **git add .gitignore**

**git commit -m 'Message'**

Guide for SSH: https://help.github.com/articles/connecting-to-github-with-ssh/

**ls -al ~/.ssh** : Check for SSH

ssh-keygen -t rsa -b 4096 -C 'alexotsu@gmail.com'

**eval "$(ssh-agent -s)"** : Start SSH agent and give public key
**ssh-add ~/.ssh/id_rsa** : matches our private key => 'identity added'
**ssh -T git@github.com** : tests SSH connection with GitHub

Follow the instructions on GitHub to create a repo there.

Download + install Heroku CLI, then login locally using **heroku login**
Once logged in, can communicate between cmd and Heroku servers
**heroku keys:add** pushes SSH key
**heroku keys:remove emailAddress** will remove the key associated with that email address

in bash: **ssh -v git@heroku.com** authenticates public/private keypair

"start" : "node script.js"
Made "start" script in package.json. Heroku-specific command, specifies which command to run
This can be run from terminal using npm start

**heroku create** will create a new Heroku remote
From there, can configure DNS to point to custom app
*/
