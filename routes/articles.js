const express = require('express');
const router = express.Router();

//bring in the models
let Article = require('../models/article');


//add Route
router.get('/add',function(req,res){
	res.render('add_article',{
		title:'add article to knowledge base'
	});
});

//Add Submit POST Route

router.post('/add',function(req,res){
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('author','Author is required').notEmpty();
	req.checkBody('body','Body is required').notEmpty();
	//Get Errors
	let errors = req.validationErrors();
	if(errors){
		res.render('add_article',{
			title:'Add Article',
			errors:errors
		});
	}
	else {

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
			req.flash('success','Article Added');
			res.redirect('/');
		}	
	});

	} 
});

//Edit Article Route 
router.get('/edit/:id',function(req,res) {
	Article.findById(req.params.id,function (err,article) {
		res.render('edit_article',{
		title:'Edit Article',
		article:article
		
	});
	});
});

//Update Submit POST Route

router.post('/edit/:id',function(req,res){
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
			req.flash('success','Article Updated')
			res.redirect('/');
		}
		
	});
});





//Delete Article Route
router.delete('/:id',function (req,res) {
	let query = {_id:req.params.id}

	Article.remove(query,function (err) {
		if(err){
			console.log(err);
		}
		res.send('Sucess');
	});
});


//Get Single Article Route
router.get('/:id',function(req,res) {
	Article.findById(req.params.id,function (err,article) {
		res.render('article',{
		article:article
	});
	});
});

module.exports = router;