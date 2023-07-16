const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Verbindung zur MongoDB-Datenbank herstellen

require("dotenv").config({ path: ".env.local" });

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());

// MongoDB-Modell für Aufgaben
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  color: String,
});

const Task = mongoose.model("Task", TaskSchema);

// API-Endpunkt zum Abrufen aller Aufgaben
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Aufgaben" });
  }
});

// API-Endpunkt zum Erstellen einer Aufgabe
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status, color } = req.body;
    const task = new Task({ title, description, status, color });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Erstellen der Aufgabe" });
  }
});

// API-Endpunkt zum Aktualisieren einer Aufgabe
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { title, description, status, color } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, color },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Aktualisieren der Aufgabe" });
  }
});

// API-Endpunkt zum Löschen einer Aufgabe
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Aufgabe erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen der Aufgabe" });
  }
});

// Beispielroute für die Authentifizierung
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hier kannst du den Code zur Benutzerauthentifizierung implementieren
    // Zum Beispiel: Überprüfung des Benutzernamens und Passworts in der Datenbank

    // Beispielcode zum Hashen des Passworts
    const hashedPassword = await bcrypt.hash(password, 10);

    // Beispielcode zum Generieren eines JWT-Token
    const token = jwt.sign({ username }, "secret-key");

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Fehler bei der Authentifizierung" });
  }
});

app.listen(5000, () => {
  console.log("Server gestartet auf Port 5000");
});
