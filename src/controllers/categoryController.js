const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const { StatusCodes } = require('http-status-codes');

const getCategoryController = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Unable to fetch category information', data: categories
        });
    }

    return res.status(StatusCodes.OK).json({ message: 'Categories fetched successfully.', data: categories });
});

const createCategoryController = asyncHandler(async (req, res) => {
    const { title, description, isActive } = req.body;

    if (!title) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Title is required', data: null
        });
    }

    const newCategory = new Category({
        title,
        description,
        isActive
    });

    const responseData = await newCategory.save();
    if (responseData) {
        return res.status(StatusCodes.CREATED).json({ message: 'Category created successfully.', data: responseData });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Something went wrong.', data: responseData });
});

const updateCategoryController = asyncHandler(async (req, res) => {
    const { title, description, isActive } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ID not found in the URL', data: null
        });
    }

    const category = await Category.findById(id);
    if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found with the given ID', data: null });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { title, description, isActive },
        { new: true }
    );

    if (updatedCategory) {
        return res.status(StatusCodes.OK).json({ message: 'Category updated successfully', data: updatedCategory });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unable to update category.', data: null });
});

const deleteCategoryController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ID not found in the URL', data: null
        });
    }

    const category = await Category.findById(id);
    if (!category) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found with the given ID', data: null });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (deletedCategory) {
        return res.status(StatusCodes.OK).json({ message: 'Category deleted successfully', data: deletedCategory });
    }

    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unable to delete category.', data: null });
});

module.exports = {
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController
};
