const request = require('supertest');
const app = require('../../app');
const { expect } = require('chai');
const Category = require('../models/categoryModel');

require('dotenv').config({ path: '.env.dev' });

describe('Category API Controller Tests', () => {

    // Test GET all categories route
    describe('GET /api/category', () => {
        it('should fetch all categories', (done) => {
            request(app)
                .get('/api/category')
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Categories fetched successfully.');
                    expect(res.body.data).to.be.an('array');
                    done();
                });
        });
    });

    // Test POST a new category route
    describe('POST /api/category', () => {
        it('should create a new category', (done) => {
            const newCategory = {
                title: 'New Category',
                description: 'A new category description',
                isActive: true
            };

            request(app)
                .post('/api/category')
                .send(newCategory)
                .expect(201)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category created successfully.');
                    expect(res.body.data).to.have.property('title', 'New Category');
                    done();
                });
        });

        it('should return 400 if title is missing', (done) => {
            const newCategory = { description: 'Missing title', isActive: true };

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
                title: 'Updated Category',
                description: 'Updated description',
                isActive: false
            };

            request(app)
                .put(`/api/category/${categoryId}`)
                .send(updatedCategory)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Category updated successfully');
                    expect(res.body.data).to.have.property('title', 'Updated Category');
                    done();
                });
        });
    });

    // Test DELETE category route
    describe('DELETE /api/category/:id', () => {
        let categoryId;

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
                    expect(res.body.message).to.equal('Category deleted successfully');
                    done();
                });
        });
    });

});
