var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

// GET home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de los comandos con :quizId
router.param('quizId', quizController.load);

// Rutas /quizes/* a quizController
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Ruta a los créditos
router.get('/author', function(req, res) {
  res.render('author', {});
});

module.exports = router;
