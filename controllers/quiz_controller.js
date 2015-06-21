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
    // Construir el patron de busqueda
    var search = "%" + req.query.search.replace(/ +/g, "%") + "%";
    models.Quiz.findAll({where: ["pregunta like ?", search], order: 'pregunta ASC'}).then(function (quizes) {
      res.render('quizes/index', {quizes: quizes, search: req.query.search});
    });
  }
};

