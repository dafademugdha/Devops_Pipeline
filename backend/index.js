const express = require("express");
const cors = require("cors");

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

let userIssues = {};

// app.get("/", (req, res) => {
//   res.send("Issue Service is running 🚀");
// });
// Create Issue
app.post("/issue", (req, res) => {
  const { title, username } = req.body;

  if (!title || !username) {
    return res.status(400).json({ error: "Title and username are required" });
  }

  const issue = {
    id: Date.now(),
    title,
    status: "pending",
    username
  };

  if (!userIssues[username]) {
    userIssues[username] = [];
  }

  userIssues[username].push(issue);

  res.status(201).json(issue);
});

// Get Issues by Username
app.get("/user/:username/issues", (req, res) => {
  const username = req.params.username;
  res.json(userIssues[username] || []);
});

// Update Issue Status
app.put("/issue/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  for (let user in userIssues) {
    const issue = userIssues[user].find(i => i.id == id);

    if (issue) {
      issue.status = status;
      return res.json({ message: "Issue status updated" });
    }
  }

  res.status(404).json({ error: "Issue not found" });
});

// Start Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Issue service running on port ${PORT}`);
});

// Export for testing
module.exports = app;