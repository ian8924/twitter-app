exports.requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
};
