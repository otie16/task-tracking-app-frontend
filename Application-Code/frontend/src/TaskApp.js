// import React, { useState } from "react";

// function TaskApp() {
//   const [tasks, setTasks] = useState([]);
//   const [task, setTask] = useState("");

//   // Handle adding a new task
//   const handleAddTask = () => {
//     if (task.trim() !== "") {
//       setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
//       setTask(""); // Clear input after adding
//     }
//   };

//   // Handle deleting a task
//   const handleDeleteTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   // Handle completing a task (cross out)
//   const handleToggleCompletion = (id) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   return (
//     <div className="task-app">
//       <h1>Task Manager</h1>
//       <div className="task-input">
//         <input
//           type="text"
//           value={task}
//           onChange={(e) => setTask(e.target.value)}
//           placeholder="Enter a task"
//         />
//         <button onClick={handleAddTask}>Add Task</button>
//       </div>

//       <ul className="task-list">
//         {tasks.map((task) => (
//           <li
//             key={task.id}
//             className={task.completed ? "completed" : ""}
//             onClick={() => handleToggleCompletion(task.id)}
//           >
//             {task.text}
//             <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TaskApp;
