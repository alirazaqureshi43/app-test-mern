const mongoose = require('mongoose')

const appSchema = mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    type:{
        type: String,
        required:true,
    },
    subscriptionDate:{
        type: String,
        required:true, 
    },
    expiryDate:{
        type: String,
        required:true, 
    },
    subscriptionAmount:{
        type: Number,
        required:true, 
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('App', appSchema)