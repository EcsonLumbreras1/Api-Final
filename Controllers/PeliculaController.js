require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a la BD:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// 🟢 GET: obtener todas las películas
exports.obtenerPeliculas = (req, res) => {
    db.query('SELECT * FROM peliculas', (err, results) => { // usa minúsculas
        if (err) {
            console.error('❌ Error al obtener películas:', err);
            return res.status(500).json({ error: 'Error al obtener películas' });
        }
        res.json(results);
    });
};

// 🟢 POST: insertar una película
exports.insertarPelicula = (req, res) => {
    const { id, titulo, director, genero, anio, descripcion } = req.body;

    // ahora id se inserta manualmente
    db.query(
        'INSERT INTO peliculas (id, titulo, director, genero, anio, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [id, titulo, director, genero, anio, descripcion],
        (err, result) => {
            if (err) {
                console.error('❌ Error al insertar:', err);
                return res.status(500).json({ error: 'Error al insertar película' });
            }
            res.json({ id: result.insertId, mensaje: 'Película agregada' });
        }
    );
};

// 🟢 DELETE: eliminar por ID
exports.eliminarPelicula = (req, res) => {
    db.query('DELETE FROM peliculas WHERE id = ?', [req.params.id], err => {
        if (err) {
            console.error('❌ Error al eliminar:', err);
            return res.status(500).json({ error: 'Error al eliminar película' });
        }
        res.send('Película eliminada');
    });
};
