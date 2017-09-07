const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const Models = require('./model/models');

const app = express();
app.use(express.static(__dirname + '/'));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Include validator here
app.use(expressValidator());

function error(code, string, res) {
	try {
		console.log(string);
		res.statusCode = code;
		res.send(string);
	} catch(err) {
		console.log(err.message);
	}
}

function createUser(req,res) {
	if (!req.body.username ||
		!req.body.email ||
		!req.body.password) {
		return error(403, "ERROR: createUser: required info not supplied", res);
	}

	console.log(Date() + 'createUser: Creating new user');
	Models.User(req.body).save( (err, results) => {
		if (err) {
			console.log(err);
			return error(403, "ERROR: createUser: Failed to create user", res);
		} else {
			console.log("createUser: Successfully created user: " + JSON.stringify(results));
			res.statusCode = 200;
			return res.send(results);
		}
	});
}

function createStore(req,res) {
	if (!req.body.storename) {
		return error(403, "ERROR: createStore: Store name not supplied", res);
	}

	console.log(Date() + 'createStore: Creating new store');
	Models.Store(req.body).save( (err, results) => {
		if (err) {
			console.log(err);
			return error(403, "ERROR: createStore: Failed to create store", res);
		} else {
			console.log("createUser: Successfully created store: " + JSON.stringify(results));
			res.statusCode = 200;
			return res.send(results);
		}
	});
}

function createFood(req,res) {
	if (!req.body.foodname) {
		return error(403, "ERROR: createFood: Food name not supplied", res);
	}

	console.log(Date() + 'createFood: Creating new food');
	Models.Food(req.body).save( (err, results) => {
		if (err) {
			console.log(err);
			return error(403, "ERROR: createFood: Failed to create food", res);
		} else {
			console.log("createFood: Successfully created food: " + JSON.stringify(results));
			res.statusCode = 200;
			return res.send(results);
		}
	});
}

function addPurchase(req,res) {
	if (!(req.body.foodid >=0) ||
		!(req.body.storeid >=0) ||
		!(req.body.unit_price >=0) ||
		!(req.body.userid >=0)) {
		return error(403, "ERROR: addPurchase: Required info not supplied", res);
	}
	
	Models.Food.findOne({_id : req.body.foodid}, (err, foodRes) => {
		if (err || !foodRes) {
			console.log(err);
			error(403, "ERROR: addPurchase: foodid is invalid", res);
		
		} else {
			Models.User.findOne({_id : req.body.userid}, (err, userRes) => {
				if (err || !userRes) {
					console.log(err);
					error(403, "ERROR: addPurchase: userid is invalid", res);	
				
				} else {
					Models.Store.findOne({_id : req.body.storeid}, (err, storeRes) => {
						if (err || !storeRes) {
							console.log(err);
							error(403, "ERROR: addPurchase: storeid is invalid", res);
						
						} else {
							//ALL IDS ARE VALID HERE
							console.log(Date() + 'addPurchase: Creating new purchase');
					

							Models.Purchase(req.body).save( (err, results) => {
								if (err) {
									console.log(err);
									return error(403, "ERROR: addPurchase: Failed to create purchase", res);
								} else {
									console.log("addPurchase: Successfully created purchase: " + JSON.stringify(results))
									res.statusCode = 200;
									return res.send(results);
								}
							});
						}
					})
				}
			})
		}
	})
}


app.post('/user', createUser);
app.post('/store', createStore);
app.post('/food', createFood);
app.post('/purchase', addPurchase);

app.listen(process.env.PORT || 3000);
console.log('\n****Groente Server started @ ' + Date() + '\nListening on port 3000****\n');
