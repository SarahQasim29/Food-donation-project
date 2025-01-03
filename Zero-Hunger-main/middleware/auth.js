// middleware/auth.js

module.exports.ensureAdminLoggedIn = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "You must be an admin to access this page");
    return res.redirect("/"); // Redirect to homepage or login page if not admin
  }
  next();
};

module.exports.ensureUserLoggedIn = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to access this page");
    return res.redirect("/login"); // Redirect to login page if not logged in
  }
  next();
};
