const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator =require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//connect to the database 

mongoose.connect('mongodb://localhost/nodekb');
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

//Get Single Article Route
app.get('/article/:id',function(req,res) {
	Article.findById(req.params.id,function (err,article) {
		res.render('article',{
		article:article
	});
	});
});

//Edit Article Route 
app.get('/article/edit/:id',function(req,res) {
	Article.findById(req.params.id,function (err,article) {
		res.render('edit_article',{
		title:'Edit Article',
		article:article
		
	});
	});
});


//add article route
app.get('/articles/add',function(req,res){
	res.render('add_article',{
		title:'add article to knowledge base'

	});

});

//Add Submit POST Route

app.post('/articles/add',function(req,res){
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.flash('sucess','Article Added');
			res.redirect('/');
		}	
	});
});

//Update Submit POST Route

app.post('/article/edit/:id',function(req,res){
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}

	Article.update(query,article,function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
		
	});
});

//Delete Article Route
app.delete('/article/:id',function (req,res) {
	let query = {_id:req.params.id}

	Article.remove(query,function (err) {
		if(err){
			console.log(err);
		}
		res.send('Sucess');
	});
});
app.listen(3000,function(){
	console.log('server started on port 3000 ...')
});