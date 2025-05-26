require('dotenv').config();
const mysql = require('mysql2');

// 🔌 Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la BD:', err.message);
    process.exit(1); // Detiene el servidor si no hay conexión
  }
  console.log('✅ Conectado a MySQL');
});

// 📥 Obtener todas las películas
exports.obtenerPeliculas = (req, res) => {
    console.log('🎬 Obteniendo películas...');
  
    db.query('SELECT * FROM peliculas', (err, results) => {
      if (err) {
        console.error('❌ Error en SELECT:', err.message);
        return res.status(500).json({ error: 'Error al obtener las películas' });
      }
      res.json(results);
    });
  };

// ➕ Insertar una nueva película
exports.insertarPelicula = (req, res) => {
  const { id, titulo, director, genero, anio, descripcion } = req.body;

  // Validar campos
  if (!id || !titulo || !director || !genero || !anio || !descripcion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  db.query(
    'INSERT INTO Peliculas (id, titulo, director, genero, anio, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
    [id, titulo, director, genero, anio, descripcion],
    (err, result) => {
      if (err) {
        console.error('❌ Error en INSERT:', err.message);
        return res.status(500).send('Error al insertar');
      }
      res.json({ mensaje: 'Película agregada', id: result.insertId });
    }
  );
};

// ❌ Eliminar una película por ID
exports.eliminarPelicula = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM Peliculas WHERE id = ?', [id], err => {
    if (err) {
      console.error('❌ Error en DELETE:', err.message);
      return res.status(500).send('Error al eliminar');
    }
    res.send(`Película con id ${id} eliminada`);
  });
};
