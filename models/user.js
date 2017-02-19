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
let FavSchema = new Schema({ 
    productId: {
        type: mongoose.Schema.Types.String,
        ref: 'Product'
    },
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

let LoginsSchema = new Schema({
    identityKey: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    failedAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    timeout: {
        type: Date,
        required: true,
        default: new Date()
    },
    inProgress: {
        type: Boolean,
        default: false
    }
});
// LoginsSchema.static("inProgress", async function(key) {
//     const login = await this.findOne({identityKey: key});
//     const query = {identityKey: key};
//     const update = {inProgress: true};
//     const options = {setDefaultsOnInsert: true, upsert: true};
//     await this.findOneAndUpdate(query, update, options).exec();
//     return (login && login.inProgress);
// });

// LoginsSchema.static("canAuthenticate", async function (key) {
//     const login = await this.findOne({identityKey: key});

//     if (!login || login.failedAttempts < 5 ){
//         return true;
//     }

//     const timeout = (new Date() - new Date(login.timeout).addMinutes(1));
//     if (timeout >= 0) {
//         await login.remove();
//         return true;
//     }
//     return false;
// });

// LoginsSchema.static("failedLoginAttempt", async function (key) {
//     const query = {identityKey: key};
//     const update = {$inc: {failedAttempts: 1}, timeout: new Date(), inProgress: false};
//     const options = {setDefaultsOnInsert: true, upsert: true};
//     return  await this.findOneAndUpdate(query, update, options).exec();
// });

// LoginsSchema.static("successfulLoginAttempt", async function (key) {
//     const login = await this.findOne({identityKey: key});
//     if (login) {
//         return await login.remove();
//     }
// });

let userSchema = Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        sparse: true,
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    password : {
        type: String,
        require: true,
        match: /(?=.*[a-zA-Z])(?=.*[0-9]+)(?=.*[!@#$%^&*()_+]+).*/        
    },
    socials: {
        facebook_id: String,
        google_id: String,
        github_id: String,
    },
    googleId: String,
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
        favorite: [FavSchema],
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
    bcrypt.compare(passwordToTest, this.password, function (err, isMatch){
        if (err) {  return  callback(err) }
        return callback(null, isMatch);
    });
}

//#2 create model
module.exports=mongoose.model('User',userSchema, 'users');