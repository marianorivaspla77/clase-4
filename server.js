const express = require('express');
const cors = require('cors');
const { conectarDB } = require('./database.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Variable global para la conexión
let db;

// Inicializar servidor y base de datos
async function iniciarServidor() {
    try {
        db = await conectarDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
    }
}

// Ruta para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios ORDER BY id DESC');
        res.json({ usuarios: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ usuario: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para agregar nuevo usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, edad } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)',
            [nombre, email, edad]
        );
        
        res.json({ 
            message: 'Usuario agregado correctamente', 
            id: result.insertId 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'El email ya existe' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Ruta para actualizar usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { nombre, email, edad } = req.body;
        const id = req.params.id;
        
        const [result] = await db.execute(
            'UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?',
            [nombre, email, edad, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const [result] = await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API con MySQL funcionando!' });
});

iniciarServidor();