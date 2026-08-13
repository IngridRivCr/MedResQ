//Creación del Pool de conexiones con la base de datos que permite que el backend pueda hacer CRUD de información almacenada.

//Librerías
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

//Conexiones activas con un máximo de 10 consultas simultaneas sin bloquearse
//Aiven exige SSL (ssl-mode=REQUIRED), por eso se agrega el bloque ssl
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // Aiven usa un certificado propio; con esto se cifra la conexión.
    // Para producción real conviene validar contra el ca.pem de Aiven.
    rejectUnauthorized: false
  }
});

// Mensaje de confirmación para confirmar que too esté en orden cuando se conecta a la DB
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error de conexión inicial con MySQL:", err.message);
  } else {
    console.log("Conexión a la base de datos MedResQ establecida con éxito.");
    connection.release(); //Ayuda a liberar la conexión de prueba
  }
});