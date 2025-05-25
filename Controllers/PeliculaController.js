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

exports.obtenerPeliculas = (req, res, next) => {
    db.query('SELECT * FROM Peliculas', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);  // 👈 Agrega esto
            return next(new Error('Error al obtener películas'));
        }
        res.json(results);
    });
};


exports.insertarPelicula = (req, res) => {
    const { titulo, director, genero, anio, descripcion } = req.body;
    db.query(
        'INSERT INTO Peliculas (titulo, director, genero, anio, descripcion) VALUES (?, ?, ?, ?, ?)',
        [titulo, director, genero, anio, descripcion],
        (err, result) => {
            if (err) return res.status(500).send('Error al insertar');
            res.json({ id: result.insertId, mensaje: 'Película agregada' });
        }
    );
};

exports.eliminarPelicula = (req, res) => {
    db.query('DELETE FROM Peliculas WHERE id = ?', [req.params.id], err => {
        if (err) return res.status(500).send('Error al eliminar');
        res.send('Película eliminada');
    });
};