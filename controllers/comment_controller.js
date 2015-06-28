var models = require("../models/models");

// Autoload de :commentId
exports.load = function(req, res, next, commentId) {
  models.Comment.find({
    where: {
      id: Number(commentId)
    }
  }).then(function(comment) {
    if (comment) {
      req.comment = comment;
      next();
    }
    else {
      next(new Error('No existe commentId=' + commentId));
    }
  }).catch(function(err) {
    next(err);
  });
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  var comment = models.Comment.build({
    texto: ""
  });

  // Renderizar el formulario de creación de comentarios
  res.render('comments/new', {comment: comment, quiz: req.quiz});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  // Crea objeto comment incializado con los datos recibidos del formulario
  var comment = models.Comment.build({
    texto: req.body.comment.texto,
    QuizId: req.quiz.id
  });

  // Validar los datos en el modelo
  comment.validate().then(function(err) {
    if (err) {
      res.render('comments/new', {comment: comment, quiz: req.quiz, errors: err.errors});
    }
    else {
      // Valida Ok: guardar los datos en la BBDD
      comment.save().then(function() {
        // Todo bien, redireccionar a la pregunta con la lista de comentarios
        res.redirect('/quizes/'+req.quiz.id);
      });
    }
  }).catch(function (err) {next(err);});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save({fields: ["publicado"]}).then(function() {
    res.redirect('/quizes/'+req.quiz.id);
  }).catch(function(err) {
    next(err);
  });
};

