const express = require('express');
const connectDatabase = require('./src/config/dbconfig');
const categoryRouter = require('./src/routes/categoryRoute');
const locationRouter = require('./src/routes/locationRoute');
const serviceRouter = require('./src/routes/serviceRoute');
const productRouter = require('./src/routes/productRoute');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const hostname = process.env.HOSTNAME ?? "localhost"; // 127.0.0.0
const port = process.env.PORT ?? "5000";

// Connecting with Database
connectDatabase()

// Middlewares
app.use(express.json()) // Body pharser

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mini E-Commerce API',
            version: '1.0.0',
            description: 'API documentation for Mini E-Commerce platform',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://${hostname}:${port}/api`,
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

// Swagger docs setup
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routings
app.use('/api/category', categoryRouter)
app.use('/api/location', locationRouter)
app.use('/api/service', serviceRouter)
app.use('/api/product', productRouter)

// Server Start Process
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})

module.exports = app;