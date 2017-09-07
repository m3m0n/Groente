const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.connect('mongodb://localhost/Groente');
// Doc for Mongoose Schemas: http://mongoosejs.com/docs/guide

autoIncrement.initialize(connection);
var Schema = mongoose.Schema;

const userSchema = new Schema({
	_id : {
		type : Number
	},
	username : {
		type : String,
		required: true,
		unique: true,
	},
	email : {
		type : String,
		validate: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/,
		unique : true,
		required : true
	},
	password : {
		type : String,
		required : true
	},
	name : {
		type: String,
		default : ""
	},
	__v: {
		type: Number, 
		select: false
	}
}, {collection : 'users'});

const storeSchema = new Schema({
	_id : {
		type: Number
	}, 
	storename : {
		type: String, 
		unique : true,
		required:true
	},
	parent : {
		type: String, 
		default:""
	},
	address : {
		type: String, 
		default:""
	},
	__v: {
		type: Number, 
		select: false
	}
}, {collection : 'stores'});

const foodSchema = new Schema({
	_id : {
		type: Number
	}, 
	foodname : {
		type: String, 
		required : true,
		unique : true
	},
	category : {
		type: String, 
		default:""
	},
	units : {
		type: String, 
		default:""
	},
	__v: {
		type: Number, 
		select: false
	}
}, {collection : 'foods'});

const purchaseSchema = new Schema({
	_id : {
		type: Number
	}, 
	foodid : {
		type : Number,
		ref : 'foods',
		required:true
	},
	storeid : {
		type : Number,
		ref : 'stores',
		required:true
	},
	userid : {
		type : Number,
		ref : 'users',
		required:true
	},
	unit_price : {
		type: Number, 
		required : true,
		default: 0
	},
	entered_at : {
		type: Date, 
		required: true, 
		default: Date
	},
	sale : {
		type: Boolean, 
		default: false
	},
	rating : {
		type : Number,
		default : 0
	},
	__v: {
		type: Number, 
		select: false
	}
}, {collection : 'purchases'});

userSchema.plugin(autoIncrement.plugin, 'User');
storeSchema.plugin(autoIncrement.plugin, 'Store');
foodSchema.plugin(autoIncrement.plugin, 'Food');
purchaseSchema.plugin(autoIncrement.plugin, 'Purchase');

module.exports = {
  User: mongoose.model('users', userSchema),
  Store: mongoose.model('stores', storeSchema),
  Food: mongoose.model('foods', foodSchema),
  Purchase: mongoose.model('purchases', purchaseSchema)
};
