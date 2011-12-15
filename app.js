/**


 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Mongolian = require("mongolian")
  , $ = require("jquery")
  , zappa = require('zappa')


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.get('/save/:left/:topV/:elemId', function(req, res){
    res.send('datasaved <p />left:' + req.params.left + '<br/>top:' + req.params.topV)
    $("<h1>test passes</h1>").appendTo("body");
    var server = new Mongolian
    var db = server.db("test")
    var posts = db.collection("posts")
    var comments = db.collection("comments")
	posts.save({_id: req.params.elemId,left: req.params.left,top: req.params.topV})
	res.render('update',{item:req.params.elemId, left:req.params.left, top:req.params.top})
});



app.get('/load/:loadId', function(req,res){
    var server = new Mongolian
    var db = server.db("test")
    var posts = db.collection('posts')    
    var totalRecords = req.params.loadId
	var totalRecords = parseInt(totalRecords) -1	
	posts.find().skip(totalRecords).limit(1).forEach(function(post){
        var leftVal = post.left
        var topVal = post.top
//		res.render('load', {left: leftVal, top:topVal})	       		
		res.json({left: leftVal, top:topVal})	       		
	})
/*
    posts.find().skip(totalRecords).forEach(function(post){
	        var leftVal = post.left
        var topVal = post.top
	res.render('load', {left: leftVal, top:topVal})	       	
    }, function(err){    	
    	if (err.length){
		    console.log('error finding db records')	  
    	}
    })
*/
})



app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
