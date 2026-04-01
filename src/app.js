const express = require('express');
const app = express();
app.use(express.json());

const tasksRouter = require("./routes/tasks");

app.get('/', (req, res) => {
  res.json({ message: "Welcome from Main branch" });
});

app.use("/tasks", tasksRouter);

if (require.main === module) { 
  app.listen(3000, () => console.log("API running on port 3000")); 
} 
module.exports = app;