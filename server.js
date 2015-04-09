/**
 * Created by subratrout on 4/7/15.
 */
// require the path module
var path = require('path');

// require express and create the express app
var express = require('express');
var app = express();

// require bodyParser since we need to handle post data for adding a user
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}
));

// static content
app.use(express.static(__dirname+"/static"));

// For css file

// setting up ejs and our view folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// listen on 8000
var server = app.listen(8000, function(){
    console.log("Listening on port 8000");
});

// require mongoose and create the mongoose variable
var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');

var MongooseSchema = new mongoose.Schema({
    name: String,
    age: Number,
    description: String,
    hobbies: String,
    date: {type: Date, default: Date.now}
})

var Mongoose = mongoose.model('mongoose', MongooseSchema);

// Add validations using the .path() method.
MongooseSchema.path('name').required(true, 'Name cannot be blank');
MongooseSchema.path('age').required(true, 'Age cannot be blank');
MongooseSchema.path('description').required(true, 'Description cannot be blank');
MongooseSchema.path('hobbies').required(true, 'Hobbies cannot be blank');

// route to add a user
app.post('/mongoose', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    var mongoose = new Mongoose({name: req.body.name, age: req.body.age, description: req.body.description, hobbies: req.body.hobbies});
    mongoose.save(function(error){
        if(error){
            console.log("Something went wrong!");
            res.render('new', {title: 'you have errors!', errors: mongoose.errors});
            console.log(error);
        }
        else {
            console.log("Successfully added a Mongoose!");
            res.redirect('/');
        }
    })
})


// Get User

// Show list of all mongoose in our root file

app.get('/', function(request, response){

    Mongoose.find({}, function(error, mongooses){
        if(error){
            console.log("Quotes can't be found");
        }

        else {
            console.log("Quotes displayed.");
            response.render("index", {mongoose:mongooses});
        }
    })
})

// Get Form to create Mongoose

app.get('/mongoose/new', function(req, res){
    res.render('new');
})


// Get one mongoose by id
app.get('/mongoose/:id', function (req, res){
    // first parameter is the query document.  Second parameter is the callback
    Mongoose.findOne({_id: req.params.id}, function (err, mongoose){
        // loads a view called 'mongoose.ejs' and passed the user object to the view!
        res.render('mongoose', {data: mongoose});
        console.log(mongoose);
    })
})

app.get('/mongoose/edit/:id', function(req, res){
    Mongoose.findOne({_id: req.params.id}, function (err, mongoose){
        // loads a view called 'mongoose.ejs' and passed the user object to the view!
        res.render('edit', {data: mongoose});
        console.log(mongoose);
    })
})


app.post('/mongoose/update/:id', function (req, res){
    console.log(req.body);
    console.log(req.params.id);

    Mongoose.update({_id: req.params.id}, {name:req.body.name, age: req.body.age, description: req.body.description, hobbies: req.body.hobbies}, function(err, results){
        console.log(results);
        if(err){
            console.log('error');
        }
        else{
            console.log('no error');
            res.redirect('/');
        }
    })
})

app.get('/mongoose/delete/:id', function (req, res){

    Mongoose.remove({_id: req.params.id}, function(err, results){
        if(err){
            console.log('Mongoose not deleted');
        }
        else{
            console.log('Mongoose deleted');
            res.redirect('/');
        }
    })
})
