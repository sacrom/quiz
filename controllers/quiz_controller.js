var models = require("../models/models");

// GET /quizes/:quizId
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {quiz: quiz});
	});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer',
				   {quiz: quiz, respuesta: '<h2 class="alert-success">Correcto</h2>'});
		} else {
			res.render('quizes/answer',
				   {quiz: quiz, respuesta: '<h2 class="alert-danger">Incorrecto</h2>'});
		}
	});
};

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/index', {quizes: quizes});
	});
};

