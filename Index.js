require('dotenv').config();
const express = require('express');
const app = express();
const peliculaRouter = require('./Router/Pelicularouter');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const winston = require('winston');

// Configurar winston para guardar errores en Logs/error.log
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
 
let swaggerDocument;
try {
  swaggerDocument = YAML.load('./swagger.yaml');
} catch (error) {
  console.error('❌ Error al cargar swagger.yaml:', error.message);
  process.exit(1); // Detiene la ejecución
}

app.use(express.json());
app.use('/api/peliculas', peliculaRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Middleware para manejar errores
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
  

app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
  console.log('📘 Swagger en http://localhost:3000/api-docs');
});
