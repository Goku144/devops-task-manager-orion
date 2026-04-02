const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// 1. Define the Database Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// 2. Default Initial Values
const initialTasks = [
  { title: "Initial task", completed: true },
  { title: "Install Git and Node.js", completed: true },
  { title: "Learn DevOps basics", completed: false },
  { title: "Mergine the first time", completed: true }
];

// 3. SEEDING LOGIC: Runs once to fill the DB if it's empty
const seedDatabase = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(initialTasks);
      console.log("Database seeded with default tasks!");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

// Execute the seed (only once per app start)
seedDatabase();

// 4. GET route - Reads from MongoDB
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 5. POST route - Saves new data to MongoDB
router.post('/', async (req, res) => {
  try {
    let savedTasks;
    if (Array.isArray(req.body)) {
      savedTasks = await Task.insertMany(req.body);
    } else {
      const newTask = new Task({
        title: req.body.title,
        completed: req.body.completed ?? false
      });
      savedTasks = await newTask.save();
    }
    res.status(201).json(savedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

module.exports = router;