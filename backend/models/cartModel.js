const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
                require: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            selected: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true})

module.exports = mongoose.model("Cart", cartSchema);
