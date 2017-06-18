const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator =require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');

//connect to the database 

mongoose.connect(config.database);
let db = mongoose.connection;

//check connection
db.once('open',function(){
	console.log('connection to mongoDB');
});

//check DB errors 
db.on('error',function(err){
	console.log('err'); 
})
//bring in the models
let Article = require('./models/article');

//load view Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body-parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  }));

//Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//Home route
app.get('/', function (req,res) {
	
	Article.find({},function(err,articles){
		if(err){
			console.log(err);
		}
		else {
			res.render('index',{
		title:'Articles',
		articles:articles
		});

		}
		
	});
	
});

//route to file

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);

app.listen(3000,function(){
	console.log('server started on port 3000 ...')
});