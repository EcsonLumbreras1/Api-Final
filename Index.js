require('dotenv').config();
const express = require('express');
const app = express();

const peliculaRouter = require('./Router/Pelicularouter.js');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const winston = require('winston');
const fs = require('fs');

// 📄 Documentación Swagger
let swaggerDocument;
try {
  swaggerDocument = YAML.load('./swagger.yaml');
} catch (error) {
  console.warn('⚠️ Swagger no encontrado o inválido');
}

// 📝 Logger de errores
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: './Logs/error.log' })
  ]
});

// 🔌 Middlewares
app.use(express.json());
app.use('/api/peliculas', peliculaRouter);
if (swaggerDocument) {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}

// ❌ Manejo de errores
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    body: req.body
  });
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 🚀 Puerto: Railway usa por defecto el 8080, o el que venga en process.env.PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
