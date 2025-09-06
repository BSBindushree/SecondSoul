module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.userId) return next();
    return res.redirect('/auth/login');
  },
  attachUser: (req, res, next) => {
    res.locals.currentUser = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
    next();
  }
};
