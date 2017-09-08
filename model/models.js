const mongoose = require('mongoose');
const connection = mongoose.connect('mongodb://localhost/GroenteTest', {
  useMongoClient: true
});
// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide

var Schema = mongoose.Schema;

const userSchema = new Schema({
	username : { type: String, required: true,	unique: true },
	password : { type: String, required: true },
	name : { type: String, default: "" },
	email : { type: String, unique: true, validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/}, 
});


const storeSchema = new Schema({
	storename : { type: String, required: true, unique: true },
	parent : { type: String,  default: "" },
	address : { type: String, default: "" },
});

const purchaseSchema = new Schema({
	storeid : { type: Schema.Types.ObjectId, ref: 'stores', required:true },
	user : { type: Schema.Types.ObjectId, ref: 'users', required:true },
	unitprice : { type: Number, required: true},
	date : { type: Date, default: Date.now },
	saleprice : { type: Boolean, default: false },
	rating : { type: Number, min: 0, max: 5, default: 0 }
});

const foodSchema = new Schema({
	name : {type: String, unique: true, default: "" },
	purchases : [purchaseSchema]
});

const foodCatSchema = new Schema({
	category : { type: String, required: true,	unique: true },
	units : { type: String, default: "kg" },
	foods : [foodSchema],
});


module.exports = {
	User: mongoose.model('users', userSchema),
	Store: mongoose.model('stores', storeSchema),
	Purchase: mongoose.model('purchases', purchaseSchema),
	Food: mongoose.model('foods', foodSchema),
	FoodCat: mongoose.model('foodcat', foodCatSchema)
};
