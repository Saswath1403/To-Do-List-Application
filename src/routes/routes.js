const express = require("express");
const route = express.Router();
const {
  createToDoList,
  getToDoListById,
  getTaskList,
  updateTask,
  updateListItem,
  removeListItem,
  deleteTaskById,
} = require("../controllers/taskController"); // Destructuring & Importing

// Post Api Route
route.post("create/", createToDoList);

// Get Api Routes
route.get("/list/:taskId", getToDoListById);
route.get("/tasks/", getTaskList);

// Update Api Routes
route.put("/task/:taskId", updateTask);
route.put("/listItem/:taskId", updateListItem);

// Delete Api Routes
route.delete("/listItem/:taskId", removeListItem);
route.delete("/task/:taskId", deleteTaskById);

module.exports = route;  // Exporting route
