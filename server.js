var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var userController = require('./controllers/user');

mongoose.connect('mongodb://localhost:27017/infinitlee');

var app = express();
app.use(bodyParser.urlencoded({
	extended: true;
}));

var port = process.env.PORT || 3000;

//Add all routes to the router object and extend them accordingly
var router = express.Router();

//User Routers-----------------------------------
var usersRoute = router.route('/users');
var userRoute = router.route('/users/:id');
//-----------------------------------------------

//Add all API endpoints here
router.get('/', function(req,res){
	res.json({ message: "node-endpoint"});
});

//User Endpoints----------------------------------
usersRoute
.post(userController.createUser)
.get(userController.getUsers);

userRoute
.get(userController.getUser)
.put(userController.updateUser)
.delete(userController.removeUser);
//------------------------------------------------


//Register routes with /api/v1
app.use('/api/v1', router);

app.listen(port);

console.log('Server listening on port ' + port);