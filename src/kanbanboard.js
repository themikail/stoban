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
        color: newTaskColor,
      };

      await axios.post("/api/tasks", newTask);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskStatus(STATUS_OPTIONS[0]);
      setNewTaskColor("");

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

  const startEditTask = (
    taskId,
    taskTitle,
    taskDescription,
    taskStatus,
    taskColor
  ) => {
    setEditTaskId(taskId);
    setEditTaskTitle(taskTitle);
    setEditTaskDescription(taskDescription);
    setEditTaskStatus(taskStatus);
    setEditTaskColor(taskColor);
  };

  const cancelEditTask = () => {
    setEditTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskStatus("");
    setEditTaskColor("");
  };

  const saveEditedTask = async () => {
    try {
      const updatedTask = {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
        color: editTaskColor,
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
  const [newTaskColor, setNewTaskColor] = useState("");
  const [isNewTaskDropdownOpen, setIsNewTaskDropdownOpen] = useState(false);

  // State for edit task form
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");
  const [editTaskColor, setEditTaskColor] = useState("");
  const [isEditTaskDropdownOpen, setIsEditTaskDropdownOpen] = useState(false);

  // State for delete task modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const handleToggleNewTaskDropdown = () => {
    setIsNewTaskDropdownOpen(!isNewTaskDropdownOpen);
  };

  const handleToggleEditTaskDropdown = () => {
    setIsEditTaskDropdownOpen(!isEditTaskDropdownOpen);
  };

  const handleColorOptionClick = (color) => {
    if (isNewTaskDropdownOpen) {
      setNewTaskColor(color);
      setIsNewTaskDropdownOpen(false);
    } else if (isEditTaskDropdownOpen) {
      setEditTaskColor(color);
      setIsEditTaskDropdownOpen(false);
    }
  };

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
          <ColorDropdownContainer>
            <ColorDropdownButton onClick={handleToggleNewTaskDropdown}>
              <ColorCircle style={{ backgroundColor: newTaskColor }} />
            </ColorDropdownButton>
            <ColorOptions isOpen={isNewTaskDropdownOpen}>
              <ColorOption onClick={() => handleColorOptionClick("red")}>
                <ColorCircle style={{ backgroundColor: "red" }} />
                Rot
              </ColorOption>
              <ColorOption onClick={() => handleColorOptionClick("blue")}>
                <ColorCircle style={{ backgroundColor: "blue" }} />
                Blau
              </ColorOption>
              <ColorOption onClick={() => handleColorOptionClick("green")}>
                <ColorCircle style={{ backgroundColor: "green" }} />
                Grün
              </ColorOption>
            </ColorOptions>
            <ColorSelect
              value={newTaskColor}
              onChange={(e) => setNewTaskColor(e.target.value)}
            >
              <option value="red">Rot</option>
              <option value="blue">Blau</option>
              <option value="green">Grün</option>
            </ColorSelect>
          </ColorDropdownContainer>

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
                        <ColorDropdownContainer>
                          <ColorDropdownButton
                            onClick={handleToggleEditTaskDropdown}
                          >
                            <ColorCircle
                              style={{ backgroundColor: editTaskColor }}
                            />
                          </ColorDropdownButton>
                          <ColorOptions isOpen={isEditTaskDropdownOpen}>
                            <ColorOption
                              onClick={() => handleColorOptionClick("red")}
                            >
                              <ColorCircle style={{ backgroundColor: "red" }} />
                              Rot
                            </ColorOption>
                            <ColorOption
                              onClick={() => handleColorOptionClick("blue")}
                            >
                              <ColorCircle
                                style={{ backgroundColor: "blue" }}
                              />
                              Blau
                            </ColorOption>
                            <ColorOption
                              onClick={() => handleColorOptionClick("green")}
                            >
                              <ColorCircle
                                style={{ backgroundColor: "green" }}
                              />
                              Grün
                            </ColorOption>
                          </ColorOptions>
                          <ColorSelect
                            value={editTaskColor}
                            onChange={(e) => setEditTaskColor(e.target.value)}
                          >
                            <option value="red">Rot</option>
                            <option value="blue">Blau</option>
                            <option value="green">Grün</option>
                          </ColorSelect>
                        </ColorDropdownContainer>
                        <button onClick={saveEditedTask}>Speichern</button>
                        <button onClick={cancelEditTask}>Abbrechen</button>
                      </div>
                    ) : (
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        <div
                          style={{
                            backgroundColor: task.color,
                            width: "80px",
                            height: "20px",
                          }}
                        ></div>
                        <button onClick={() => openDeleteModal(task._id)}>
                          Löschen
                        </button>
                        <button
                          onClick={() =>
                            startEditTask(
                              task._id,
                              task.title,
                              task.description,
                              task.status,
                              task.color
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

const ColorDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ColorDropdownButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const ColorCircle = styled.span`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
`;

const ColorOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ColorOption = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ColorSelect = styled.select`
  display: none;
`;
