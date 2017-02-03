let mongoose = require('mongoose');
mongoose.Promise = global.Promise
//#1 create schema
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;

let RateSchema = new Schema({ 
    productId: {
        type: mongoose.Schema.Types.String,
        ref: 'Product'
    },
    rate: Number,
    cat: Number
});
let CartSchema = new Schema({ 
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    subtotal: {
        type: Number,
        default: 0,
        min: 0
    }
});


let userSchema = Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true //因為 Mongoose 有分大小寫
    },
    password : String,
    facebook: String,
    accessRight:  {
        type: Number,
        default: 0
    }, 
    //基本資料
    profile: {
        username: {
            type: String,
            default: ''
        },
        picture: {
            type: String,
            default: ''
        }
    },
    //傳輸資料
    data: {
        rate:[RateSchema],
        totalValue: {
            type: Number,
            default: 0
        },
        //購物車array 每個element包含產品 數量
        //reference到product id
        cart: [CartSchema]
    }

});

userSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt) => {
        if(err)	return next(err);
        bcrypt.hash(this.password, salt, null, (err, hash) => {
            if(err)	return next(err);
            this.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(passwordToTest, callback){
    console.log(passwordToTest, this.password);
    bcrypt.compare(passwordToTest, this.password, function (err, isMatch){
        if (err) {  return  callback(err) }
        return callback(null, isMatch);
    });
}

//#2 create model
module.exports=mongoose.model('User',userSchema, 'users');