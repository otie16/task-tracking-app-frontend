import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Fetch tasks from the backend API
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  // Handle adding a new task
  const handleAddTask = async () => {
    if (task.trim() !== "") {
      const newTask = { text: task, completed: false };
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setTask(""); // Clear input after adding
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handle completing a task
  const handleToggleCompletion = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="task-app">
      <h1>Task Manager</h1>
      
      {/* Input field for adding a new task */}
      <div className="task-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Display list of tasks */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.completed ? "completed" : ""}
            onClick={() => handleToggleCompletion(task.id)}
          >
            {task.text}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

