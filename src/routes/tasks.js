const express = require("express");
const router = express.Router();

const tasks = [
  {id: 1, title: "Initial task", completed: true },
  {id: 2, title: "Install Git and Node.js", completed: true },
  {id: 3, title: "Learn DevOps basics", completed: false },
  {id: 4, title: "Mergine the first time", completed: true}
];

router.get('/', (req, res) => {
  res.json(tasks);
});

router.post('/', (req, res) => {
  if(Array.isArray(req.body))
  {
      req.body.forEach((element, index) => {
      tasks.push({id: tasks.length + 1, title: element.title, completed: element.completed});
    });
  }
  else
  {
    tasks.push({id: tasks.length + 1, title: req.body.title, completed: req.body.completed});
  }
  res.status(201).json(tasks);
});

module.exports = router;