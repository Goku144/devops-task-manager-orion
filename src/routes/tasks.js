const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// 1. Schema Definition
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// 2. Your Default Initial Values
const defaultTasks = [
  { id: "1", title: "Initial task", completed: true },
  { id: "2", title: "Install Git and Node.js", completed: true },
  { id: "3", title: "Learn DevOps basics", completed: false },
  { id: "4", title: "Mergine the first time", completed: true }
];

// 3. Seeding function (Called by app.js)
const seedDatabase = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(defaultTasks);
      console.log("Default tasks added to MongoDB.");
    }
  } catch (err) {
    console.error("Error seeding tasks:", err);
  }
};

// 4. GET Route
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch tasks" });
  }
});

// 5. POST Route (Supports single task or array)
router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newTasks = await Task.insertMany(req.body);
      res.status(201).json(newTasks);
    } else {
      const newTask = new Task({
        id: Task.length + 1,
        title: req.body.title,
        completed: req.body.completed || false
      });
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    }
  } catch (err) {
    res.status(400).json({ error: "Could not save task" });
  }
});

// Export both the router and the seed function
module.exports = router;
module.exports.seedDatabase = seedDatabase;