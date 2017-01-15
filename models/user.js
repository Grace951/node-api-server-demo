var mongoose = require('mongoose');
mongoose.Promise = Promise; 
//#1 create schema
var Schema = mongoose.Schema;

var userSchema = Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    token: String,
    facebook: String,
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
        totalValue: {
            type: Number,
            default: 0
        },
        //購物車array 每個element包含產品 數量
        //reference到product id
        cart: [{
            product: {
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
        }]
    }

});

//#2 create model
module.exports=mongoose.model('User',userSchema);