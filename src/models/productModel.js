const { Schema, mongoose } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true  // product name is now mandatory
    },
    description: {
        type: String,

    },
    price: {
        type: Number,

    },
    stock: {
        type: Number,
        default: 0  // optional field, default set to 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',

    },
    image: {
        type: String,  // optional field (URL of the product image)

    },
    isActive: {
        type: Boolean,
        default: true  // optional field, default is true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
