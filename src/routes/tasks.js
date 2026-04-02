const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// 1. Updated Schema to use Number for _id
const taskSchema = new mongoose.Schema({
  _id: { type: Number }, // This lets us manually set 1, 2, 3...
  title: { type: String, required: true },
  completed: { type: Boolean, default: false } , 
  versionKey: false
});

const Task = mongoose.model('Task', taskSchema);

// 2. Default Initial Values (Now with _id)
const defaultTasks = [
  { _id: 1, title: "Initial task", completed: true },
  { _id: 2, title: "Install Git and Node.js", completed: true },
  { _id: 3, title: "Learn DevOps basics", completed: false },
  { _id: 4, title: "Mergine the first time", completed: true }
];

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

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch tasks" });
  }
});

router.post('/', async (req, res) => {
  try {
    // Calculate the next ID based on the highest existing ID
    const lastTask = await Task.findOne().sort({ _id: -1 });
    const nextId = lastTask ? lastTask._id + 1 : 1;

    if (Array.isArray(req.body)) {
      // Add numeric IDs to the array of tasks
      const tasksWithIds = req.body.map((task, index) => ({
        ...task,
        _id: nextId + index
      }));
      const newTasks = await Task.insertMany(tasksWithIds);
      res.status(201).json(newTasks);
    } else {
      const newTask = new Task({
        _id: nextId,
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

module.exports = router;
module.exports.seedDatabase = seedDatabase;