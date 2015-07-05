var models = require("../models/models");

// GET /quizes/statistics
exports.index = function(req, res) {
  models.Quiz.findAll({
    include: [{ model: models.Comment }]
  }).then(function (quizes) {
    if (quizes) {
      var numQuiz = 0;
      var numComments = 0;
      var numQuizNoComments = 0;

      // Calcular estadísticas
      quizes.forEach(function (quiz) {
        numQuiz++;
        numComments += quiz.Comments.length;
        if (quiz.Comments.length === 0) {
          numQuizNoComments++;
        }
      });

      // Renderizar el formulario con las estadísticas
      res.render('statistics/index', {numQuiz: numQuiz, numComments: numComments, numQuizNoComments: numQuizNoComments});
    }
    else {
      next(new Error('No existen preguntas'));
    }
  }).catch(function(err) {
    next(err);
  });
};

