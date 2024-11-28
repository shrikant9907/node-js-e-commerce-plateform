const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { StatusCodes } = require('http-status-codes');

const getProductController = asyncHandler(async (req, res) => {
    const products = await Product.find()
        .sort({ '_id': -1 })
        .populate('category');

    if (!products) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Unable to fetch product information', data: products
        });
    }

    return res.status(StatusCodes.OK).json({ message: 'Products fetched successfully.', data: products });
});

const createProductController = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, image, isActive } = req.body;

    if (!name || !category) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Name and Category are required', data: null
        });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category,
        image,
        isActive
    });

    const responseData = await newProduct.save();
    if (responseData) {
        return res.status(StatusCodes.CREATED).json({ message: 'Product created successfully.', data: responseData });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Something went wrong.', data: responseData });
});

const updateProductController = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, image, isActive } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ID not found in the URL', data: null
        });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found with the given ID', data: null });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, stock, category, image, isActive },
        { new: true }
    );

    if (updatedProduct) {
        return res.status(StatusCodes.OK).json({ message: 'Product updated successfully', data: updatedProduct });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unable to update product.', data: null });
});

const partialUpdateProductController = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, image, isActive } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ID not found in the URL', data: null
        });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found with the given ID', data: null });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, stock, category, image, isActive },
        { new: true }
    );

    if (updatedProduct) {
        return res.status(StatusCodes.OK).json({ message: 'Product partially updated successfully', data: updatedProduct });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unable to partially update product.', data: null });
});

const deleteProductController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ID not found in the URL', data: null
        });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Product not found with the given ID', data: null });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
        return res.status(StatusCodes.OK).json({ message: 'Product deleted successfully', data: deletedProduct });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unable to delete product.', data: null });
});

module.exports = {
    getProductController,
    createProductController,
    updateProductController,
    partialUpdateProductController,
    deleteProductController
};
