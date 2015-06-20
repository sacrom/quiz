var models = require("../models/models");

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function (quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().then(function (quiz) {
		if (req.query.respuesta === quiz[0].respuesta) {
			res.render('quizes/answer', {respuesta: '<h2 class="alert-success">Correcto</h2>'});
		} else {
			res.render('quizes/answer', {respuesta: '<h2 class="alert-danger">Incorrecto</h2>'});
		}
	});
};

