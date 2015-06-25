var models = require("../models/models");

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

