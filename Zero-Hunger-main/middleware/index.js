const middleware = {
  // Ensure the user is logged in
  ensureLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning", "Please log in first to continue");
    res.redirect("/auth/login");
  },

  // Ensure the user is an admin
  ensureAdminLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "admin") {
      req.flash("warning", "This route is allowed for admin only!!");
      return res.redirect("back");
    }
    next();
  },

  // Ensure the user is a donor
  ensureDonorLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "donor") {
      req.flash("warning", "This route is allowed for donor only!!");
      return res.redirect("back");
    }
    next();
  },

  // Ensure the user is an agent
  ensureAgentLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "agent") {
      req.flash("warning", "This route is allowed for agent only!!");
      return res.redirect("back");
    }
    next();
  },

  // Ensure the user is a collector
  ensureCollectorLoggedIn: (req, res, next) => {
    if (req.isUnauthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("warning", "Please log in first to continue");
      return res.redirect("/auth/login");
    }
    if (req.user.role != "collector") {
      req.flash("warning", "This route is allowed for collector only!!");
      return res.redirect("back");
    }
    next();
  },

  // Ensure the user is not logged in (for routes like login/signup)
  ensureNotLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash("warning", "Please logout first to continue");
      if (req.user.role == "admin") return res.redirect("/admin/dashboard");
      if (req.user.role == "donor") return res.redirect("/donor/dashboard");
      if (req.user.role == "agent") return res.redirect("/agent/dashboard");
      if (req.user.role == "collector")
        return res.redirect("/collector/dashboard");
    }
    next();
  },
};

module.exports.ensureAgentLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "agent") {
    return next();
  } else {
    req.flash("error", "You must be logged in as an agent.");
    return res.redirect("/login"); // Redirect to login if not logged in as agent
  }
};

module.exports = middleware;
