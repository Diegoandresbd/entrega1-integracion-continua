const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Configuración de la conexión a la base de datos
const pool = new Pool({
  host: process.env.DB_HOST || "db", // OJO: "db" es el nombre del contenedor de la base de datos
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "apppassword",
  database: process.env.DB_NAME || "appdb",
});

// Función para esperar a que la base de datos esté lista antes de arrancar
async function waitForDb(retries = 20, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("Conexión a PostgreSQL establecida.");
      return;
    } catch (error) {
      console.log(`Base de datos no disponible. Intento ${i}/${retries}...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("No fue posible conectar con PostgreSQL.");
}

// Ruta de inicio
app.get("/", (req, res) => {
  res.json({ message: "API de tareas - Entrega 1 Docker" });
});

// Ruta de salud (para verificar que la app y la DB hablan)
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      status: "ok",
      db: result.rows[0].now,
      message: "API y base de datos comunicadas correctamente",
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Ruta para obtener las tareas
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title, done FROM tasks ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear una nueva tarea
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "El campo title es obligatorio" });

    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
waitForDb().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API escuchando en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error(error);
  process.exit(1);
});