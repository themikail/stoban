import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import styled from "styled-components";

const STATUS_OPTIONS = [
  "To Do",
  "Nicht zugewiesen",
  "In Progress",
  "Ende",
  "Fragen",
];

Modal.setAppElement("#root");

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
      sortTasksByStatus(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sortTasksByStatus = (tasks) => {
    const sortedTasks = {};
    STATUS_OPTIONS.forEach((status) => {
      sortedTasks[status] = tasks.filter((task) => task.status === status);
    });
    setSortedTasks(sortedTasks);
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

      // Update the task list after creating the task
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      // Refresh the task list after deleting the task
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditTask = (taskId, taskTitle, taskDescription, taskStatus) => {
    setEditTaskId(taskId);
    setEditTaskTitle(taskTitle);
    setEditTaskDescription(taskDescription);
    setEditTaskStatus(taskStatus);
  };

  const cancelEditTask = () => {
    setEditTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskStatus("");
  };

  const saveEditedTask = async () => {
    try {
      const updatedTask = {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
      };

      await axios.put(`/api/tasks/${editTaskId}`, updatedTask);
      // Refresh the task list after editing the task
      fetchTasks();

      // Reset edit mode
      cancelEditTask();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = (taskId) => {
    setShowDeleteModal(true);
    setDeleteTaskId(taskId);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTaskId(null);
  };

  const confirmDeleteTask = async () => {
    try {
      await axios.delete(`/api/tasks/${deleteTaskId}`);
      // Refresh the task list after deleting the task
      fetchTasks();
      // Reset delete modal state
      closeDeleteModal();
    } catch (error) {
      console.error(error);
    }
  };

  // State for create task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(STATUS_OPTIONS[0]);

  // State for edit task form
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");

  // State for delete task modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  return (
    <Main>
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
        {/* Show Tasks */}
        <div>
          <StatusHead>
            {STATUS_OPTIONS.map((status) => (
              <div key={status}>
                <Status>{status}</Status>
                {sortedTasks[status]?.map((task) => (
                  <div key={task._id}>
                    {editTaskId === task._id ? (
                      <div>
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                        />
                        <textarea
                          value={editTaskDescription}
                          onChange={(e) =>
                            setEditTaskDescription(e.target.value)
                          }
                        ></textarea>
                        <select
                          value={editTaskStatus}
                          onChange={(e) => setEditTaskStatus(e.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button onClick={saveEditedTask}>Speichern</button>
                        <button onClick={cancelEditTask}>Abbrechen</button>
                      </div>
                    ) : (
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <button onClick={() => openDeleteModal(task._id)}>
                          Löschen
                        </button>
                        <button
                          onClick={() =>
                            startEditTask(
                              task._id,
                              task.title,
                              task.description,
                              task.status
                            )
                          }
                        >
                          Bearbeiten
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </StatusHead>
        </div>
        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Task"
        >
          <p>Sind Sie sicher, dass Sie die Aufgabe löschen möchten?</p>
          <button onClick={confirmDeleteTask}>Löschen</button>
          <button onClick={closeDeleteModal}>Abbrechen</button>
        </Modal>
      </div>
    </Main>
  );
}

export default KanbanBoard;

const Main = styled.div`
  padding: 20px 20px 0 20px;
`;

const StatusHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Status = styled.h2``;
