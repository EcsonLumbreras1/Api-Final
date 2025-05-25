require('dotenv').config();
const express = require('express');
const app = express();

const peliculaRouter = require('./Router/Pelicularouter');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const winston = require('winston');

// 📘 Swagger
let swaggerDocument;
try {
  swaggerDocument = YAML.load('./swagger.yaml');
} catch (error) {
  console.error('❌ Error al cargar swagger.yaml:', error.message);
  process.exit(1);
}

// 🔒 Winston Logger
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

// Middlewares
app.use(express.json());
app.use('/api/peliculas', peliculaRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Manejo de errores global
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    body: req.body
  });

  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// 🌐 Configurar puerto para Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
