const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://gopaldose12345:gopaldose12345@cluster0.urgwcga.mongodb.net/Taskflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskflowLogin = mongoose.model("login", {
  email: String,
  name: String,
  mobile: String,
  password: String,
  userid: String,
});

const personalTaskSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  status: String,
  priority: String,
  dueDate: Date,
  userId: String,
});

const PersonalTask = mongoose.model('PersonalTask', personalTaskSchema);

const teamTaskSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  status: String,
  priority: String,
  dueDate: Date,
  userId: String,
  otherUserIds: [String], // Array to store multiple user IDs
});

const TeamTask = mongoose.model('TeamTask', teamTaskSchema);

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: "gopal", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/api/signup", async (req, res) => {
  const { email, name, mobile, password } = req.body;

  const namePrefix = name.slice(0, 3);
  const mobileDigits = mobile.slice(0, 4);
  const userid = namePrefix + mobileDigits;

  try {
    const user = new TaskflowLogin({ email, name, mobile, password, userid });

    await user.save();

    res.status(200).send("Registration successful");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Registration failed");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await TaskflowLogin.findOne({ email, password });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Login failed");
  }
});

app.post('/api/personalTasks', async (req, res) => {
  const { projectName, description, status, priority, dueDate, userId} = req.body;
  // const userId = req.session.userid; // Retrieve the user ID from the session

  const newPersonalTask = new PersonalTask({
    projectName,
    description,
    status,
    priority,
    dueDate,
    userId,
  });

  try {
    const savedPersonalTask = await newPersonalTask.save();
    res.status(201).json(savedPersonalTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the Personal task' });
  }
});

app.post('/api/teamtask', async (req, res) => {
  const { projectName, description, status, priority, dueDate, otherUserIds } = req.body;
  const userId = req.session.userid; // Retrieve the user ID from the session

  const newTeamTask = new TeamTask({
    projectName,
    description,
    status,
    priority,
    dueDate,
    userId,
    otherUserIds,
  });

  try {
    const savedTeamTask = await newTeamTask.save();
    res.status(201).json(savedTeamTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save the team task' });
  }
});

app.post("/api/getPersonalData", async (req, res) => {
  const { userId } = req.body;

  try {
    const personalTasks = await PersonalTask.find({ userId });

    if (personalTasks) {
      res.status(200).json(personalTasks);
    } else {
      res.status(401).send("No personal tasks found for this user.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Fetching failed");
  }
});

app.post("/api/getTeamData", async (req, res) => {
  const { userId } = req.body;

  try {
    const TeamTasks = await TeamTask.find({
      $or: [{ userId: userId }, { otherUserIds: userId }]
    });

    if (TeamTasks && TeamTasks.length > 0) {
      res.status(200).json(TeamTasks);
    } else {
      res.status(401).send("No team tasks found for this user.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Fetching failed");
  }
});


app.patch('/api/teamTasksupdate/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Find the personal task by ID
    const teamTask = await TeamTask.findById(taskId);

    if (!teamTask) {
      return res.status(404).json({ message: 'Team task not found' });
    }

    // Update the personal task with the new values
    teamTask.projectName = req.body.projectName || teamTask.projectName;
    teamTask.description = req.body.description || teamTask.description;
    teamTask.status = req.body.status || teamTask.status;
    teamTask.priority = req.body.priority || teamTask.priority;
    teamTask.dueDate = req.body.dueDate || teamTask.dueDate;

    // Save the updated personal task
    await teamTask.save();

    return res.status(200).json({ message: 'Personal task updated successfully', teamTask });
  } catch (error) {
    console.error('Error updating personal task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



app.patch('/api/personalTasksupdate/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Find the personal task by ID
    const personalTask = await PersonalTask.findById(taskId);

    if (!personalTask) {
      return res.status(404).json({ message: 'Team task not found' });
    }

    // Update the personal task with the new values
    personalTask.projectName = req.body.projectName || personalTask.projectName;
    personalTask.description = req.body.description || personalTask.description;
    personalTask.status = req.body.status || personalTask.status;
    personalTask.priority = req.body.priority || personalTask.priority;
    personalTask.dueDate = req.body.dueDate || personalTask.dueDate;

    // Save the updated personal task
    await personalTask.save();

    return res.status(200).json({ message: 'Personal task updated successfully', personalTask });
  } catch (error) {
    console.error('Error updating personal task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
