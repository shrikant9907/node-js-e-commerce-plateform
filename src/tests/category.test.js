const request = require('supertest');
const app = require('../../app');
const { expect } = require('chai');
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

require('dotenv').config({ path: '.env.dev' });

// Mocha Test Suite
describe('Category API', () => {

    // Before tests, connect to the database
    // before((done) => {
    //     mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true })
    //         .then(() => done())
    //         .catch(err => done(err));
    // });

    // After tests, disconnect from the database
    // after((done) => {
    //     mongoose.connection.close()
    //         .then(() => done())
    //         .catch(err => done(err));
    // });

    // Test GET all categories route
    describe('GET /api/category', () => {
        it('should fetch all categories', (done) => {
            request(app)
                .get('/api/category')
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category Fetched Successfully.');
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });
    });

    // Test POST a new category route
    describe('POST /api/category', () => {
        it('should create a new category', (done) => {
            const newCategory = {
                title: 'New Category'
            };

            request(app)
                .post('/api/category')
                .send(newCategory)
                .expect(201)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category Create Successfully.');
                    expect(res.body.data).to.have.property('title', 'New Category');
                    done();
                });
        });

        it('should return 400 if title is missing', (done) => {
            const newCategory = {}; // Missing title

            request(app)
                .post('/api/category')
                .send(newCategory)
                .expect(400)
                .end((err, res) => {
                    expect(res.body.error).to.equal('Title is required');
                    done();
                });
        });
    });

    // Test PUT (update) category route
    describe('PUT /api/category/:id', () => {
        let categoryId;

        // Create a category to update
        before((done) => {
            const category = new Category({ title: 'Category to Update' });
            category.save()
                .then((savedCategory) => {
                    categoryId = savedCategory._id;
                    done();
                })
                .catch(err => done(err));
        });

        it('should update an existing category', (done) => {
            const updatedCategory = {
                title: 'Updated Category'
            };

            request(app)
                .put(`/api/category/${categoryId}`)
                .send(updatedCategory)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category Updated');
                    expect(res.body.data).to.have.property('title', 'Updated Category');
                    done();
                });
        });

        it('should return 404 if category not found', (done) => {
            request(app)
                .put('/api/category/invalid_id')
                .send({ title: 'Invalid Category' })
                .expect(404)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Unable to find Category with given id');
                    done();
                });
        });
    });

    // Test DELETE category route
    describe('DELETE /api/category/:id', () => {
        let categoryId;

        // Create a category to delete
        before((done) => {
            const category = new Category({ title: 'Category to Delete' });
            category.save()
                .then((savedCategory) => {
                    categoryId = savedCategory._id;
                    done();
                })
                .catch(err => done(err));
        });

        it('should delete an existing category', (done) => {
            request(app)
                .delete(`/api/category/${categoryId}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category Deleted');
                    done();
                });
        });

        it('should return 404 if category not found', (done) => {
            request(app)
                .delete('/api/category/invalid_id')
                .expect(404)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Unable to find Category with given id');
                    done();
                });
        });
    });

});
