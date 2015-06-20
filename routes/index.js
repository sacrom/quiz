var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* Rutas /quizes/* a quizController */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/* Ruta a los creditos */
router.get('/author', function(req, res) {
  res.render('author', {});
});

module.exports = router;
