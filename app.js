const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

//add website route
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
			res.redirect('/');
		}
		

	});
});

app.listen(3000,function(){
	console.log('server started on port 3000 ...')
});