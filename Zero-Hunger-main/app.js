const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const homeRoutes = require("./routes/home.js");
//const adminRoutes = require("./routes/admin.js");
//const donorRoutes = require("./routes/donor.js");
//const agentRoutes = require("./routes/agent.js");
//const collectorRoutes = require("./routes/collector.js");

// === Importing Service Routes ===
const adminRoutes = require("./services/adminService");
const agentRoutes = require("./services/agentService");
const donorRoutes = require("./services/donorService");
const collectorRoutes = require("./services/collectorService");
const authRoutes = require("./services/authService.js");

const LocationRoutes = require("./routes/Location.js"); // Add this line for agent location routes
const feedbackRoutes = require("./routes/feedbackRoutes"); // Import feedback routes
const userFeedbackRoutes = require("./routes/userFeedbackRoutes"); // Import user feedback routes

require("dotenv").config();
require("./config/dbConnection.js")();
require("./config/passport.js")(passport);

const app = express();
const server = http.createServer(app); // Use HTTP server for socket.io
const io = socketIo(server); // Initialize socket.io

// Middleware
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  next();
});

// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(donorRoutes);
app.use(adminRoutes);
app.use(agentRoutes);
app.use(collectorRoutes);
app.use(LocationRoutes); // Agent location route
app.use("/feedbacks", feedbackRoutes); // Register feedback routes for admin
app.use((req, res) => {
  res.status(404).render("404page", { title: "Page not found" });
});

// Dummy agent location data
let agentsLocation = {
  agent1: { latitude: 24.8607, longitude: 67.0011 }, // Initial dummy data
};

// Real-time updates with socket.io
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send initial agent locations to the connected client
  socket.emit("allAgentsLocation", agentsLocation);

  // Dummy updates for real-time tracking
  setInterval(() => {
    agentsLocation.agent1 = {
      latitude: agentsLocation.agent1.latitude + 0.001,
      longitude: agentsLocation.agent1.longitude + 0.001,
    };

    // Send updated location to the client
    socket.emit("locationUpdate", {
      agentId: "agent1",
      ...agentsLocation.agent1,
    });
  }, 5000); // Update every 5 seconds

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
