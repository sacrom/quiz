var path = require('path');

// Cargar ORM
var Sequelize = require('sequelize');

// Usar SQLite
var sequelize = new Sequelize(null, null, null,
			      {dialect: 'sqlite', storage: 'quiz.sqlite'}
			     );

// Importar la definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz

// sequelize.sync() crea e inicializa tabla Quiz
sequelize.sync().then(function() {
	Quiz.count().then(function (count) {
		if (count === 0) {
			// Tabla vacia. Inicializar!
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).then(function() {
				console.log('Tabla Quiz en BBDD incializada');
			});
		}
	});
});

