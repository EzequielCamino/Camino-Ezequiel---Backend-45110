const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Backend Coderhouse - Comisión 45110',
      version: '1.0.0',
      description: 'Project for Coderhouse 45110 - Ezequiel Camino'
    }
  },
  apis: [
    path.resolve('./src/docs/**/*.yaml'),
    path.resolve('./src/routes/*.router.js')
  ]
};

const spec = swaggerJsDoc(swaggerOptions);

module.exports = spec;