var models = require("../models/models");

// Autoload - Recoge y busca un quiz con el quizId recibido. Devuelve error si no lo encuentra
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function (quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    }
    else {
      next(new Error('No existe quizId=' + quizId));
    }
  }).catch(function (error) {
    next(error);
  });
};

// GET /quizes/:quizId
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
  if (req.query.respuesta === req.quiz.respuesta) {
    res.render('quizes/answer',
         {quiz: req.quiz, respuesta: '<h2 class="alert-success">Correcto</h2>'});
  } else {
    res.render('quizes/answer',
         {quiz: req.quiz, respuesta: '<h2 class="alert-danger">Incorrecto</h2>'});
  }
};

// GET /quizes
exports.index = function(req, res) {
  if (req.query.search === undefined) {
    models.Quiz.findAll({order: 'pregunta ASC'}).then(function (quizes) {
      res.render('quizes/index', {quizes: quizes, search: ""});
    });
  }
  else {
    // Construir el patrón de busqueda
    var search = "%" + req.query.search.replace(/\s+/g, "%") + "%";
    models.Quiz.findAll({where: ["pregunta like ?", search], order: 'pregunta ASC'}).then(function (quizes) {
      res.render('quizes/index', {quizes: quizes, search: req.query.search});
    });
  }
};

// GET /quizes/new
exports.new = function(req, res) {
  // Crea objecto quiz incializado pero no "salvado" en la BBDD
  var quiz = models.Quiz.build({
    pregunta: "",
    respuesta: ""
  });

  // Renderizar el formulario de creación de preguntas con el objeto incializado
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  // Crea objeto quiz incializado con los datos recibidos del formulario
  var quiz = models.Quiz.build(req.body.quiz);

  // Guardar los datos en la BBDD (solo los campos pregunta y respuesta)
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
    // Todo bien, redireccionar a la lista de preguntas
    res.redirect('/quizes');
  });
};

