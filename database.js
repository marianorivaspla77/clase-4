const mysql = require('mysql2/promise');

// Configuración de la conexión MySQL
const config = {
    host: 'localhost',
    user: 'root',
    password: '', // Cambia por tu password de MySQL
    database: 'mi_primera_bse'
};

// Función para conectar a la base de datos
async function conectarDB() {
    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Conectado a MySQL correctamente');
        
        // Crear tablas si no existen
        await crearTablas(connection);
        return connection;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error);
        throw error;
    }
}

async function crearTablas(connection) {
    // Crear tabla usuarios
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE,
            edad INT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    console.log('✅ Tablas verificadas/creadas correctamente');
}

module.exports = { conectarDB };