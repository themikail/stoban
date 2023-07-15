import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = [
  "To Do",
  "Nicht zugewiesen",
  "In Progress",
  "Ende",
  "Fragen",
];

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(STATUS_OPTIONS[0]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    try {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
      };

      await axios.post("/api/tasks", newTask);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskStatus(STATUS_OPTIONS[0]);

      // Aktualisiere die Aufgabenliste nach dem Erstellen der Aufgabe
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Titel eingeben"
        />
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Beschreibung eingeben"
        ></textarea>
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button onClick={createTask}>Aufgabe erstellen</button>
      </div>
      {/* Anzeige der Aufgaben */}
      <div>
        {tasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
