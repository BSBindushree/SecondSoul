exports.showRegister = (req, res) => res.send('Register page');
exports.register = (req, res) => res.send('Register POST');
exports.showLogin = (req, res) => res.send('Login page');
exports.login = (req, res) => res.send('Login POST');
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
