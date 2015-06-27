// GET /login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {}

  res.render('sessions/new', {errors: errors});
};

// POST /login
exports.create = function(req, res) {
  // Recoger usuario y clave
  var login = req.body.login;
  var password = req.body.password;

  // Autenticar el usuario
  var userController = require('./user_controller');
  userController.autenticar(login, password, function (error, user) {
    if (error) {
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect('/login');
      return;
    }

    // Crear la sesion de usuario en req.session.user
    req.session.user = {id: user.id, username: user.username};

    // Redireccionar al ultimo sitio guardado
    res.redirect(req.session.redir.toString());
  });
};

// GET (DELETE) /logout
exports.destroy = function(req, res) {
  delete req.session.user;

  // Redireccionar al ultimo sitio guardado
  res.redirect(req.session.redir.toString());
};

