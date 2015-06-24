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

  // Validar los datos en el modelo
  quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    }
    else {
      // Valida Ok: guardar los datos en la BBDD (solo los campos pregunta y respuesta)
      quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
        // Todo bien, redireccionar a la lista de preguntas
        res.redirect('/quizes');
      });
    }
  });
};

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
  // Renderizar el formulario de edición de preguntas con el objeto auto-cargado
  res.render('quizes/edit', {quiz: req.quiz});
};

// PUT /quizes/:quizId
exports.update = function(req, res) {
  // Actualiza el objeto auto-cargado con los datos del formulario
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  // Validar los datos en el modelo
  req.quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
    }
    else {
      // Valida Ok: guardar los datos en la BBDD (solo los campos pregunta y respuesta)
      req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
        // Todo bien, redireccionar a la lista de preguntas
        res.redirect('/quizes');
      });
    }
  });
};

// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
  // Borrar el quiz auto-cargado
  req.quiz.destroy().then(function() {
    res.redirect('/quizes');
  }).catch(function (err) {next(err)});
};

