var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authController = require('./controllers/authController');
var bodyParser = require('body-parser')

//passport
require('./public/javascripts/passport');
var passport = require('passport');

//flash
var flash = require('connect-flash');
var session = require('express-session');
var MySQLsession = require('express-mysql-session');
var {
  database
} = require('./keys');

//helpers of handlebars
var hbs = require('hbs');
var helpers = require('./public/javascripts/helpers');

//partials handlebars
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('ifeq', helpers.ifeq);
hbs.registerHelper('readWrite', helpers.readWrite);
hbs.registerHelper('buttonsRol', helpers.buttonsRol); //-> all btns

hbs.registerHelper('btnAdd', helpers.btnAdd);
hbs.registerHelper('btnEdit', helpers.btnEdit);
hbs.registerHelper('btnDelete', helpers.btnDelete);
hbs.registerHelper('btnDeleteNotificacion', helpers.btnDeleteNotificacion);
hbs.registerHelper('btnDelete2', helpers.btnDelete2);
hbs.registerHelper('btnPrint', helpers.btnPrint);
hbs.registerHelper('btnShow', helpers.btnShow);
hbs.registerHelper('btnJustificar', helpers.btnJustificar);
hbs.registerHelper('btnAddInasistencia', helpers.btnAddInasistencia);
hbs.registerHelper('btnAddNovedad', helpers.btnAddNovedad);
hbs.registerHelper('btnAddNotificacion', helpers.btnAddNotificacion);

hbs.registerHelper('btnJustificarInasisencia', helpers.btnJustificarInasisencia);
hbs.registerHelper('btnDelInasistencia', helpers.btnDelInasistencia);

hbs.registerHelper('btnDelNovedad', helpers.btnDelNovedad);

hbs.registerHelper('btnDelNotificacion', helpers.btnDelNotificacion);

hbs.registerHelper('calcPercentFaltas', helpers.calcPercentFaltas);
hbs.registerHelper('mayorOigual', helpers.mayorOigual);
hbs.registerHelper("counter", function (index) {
  return index + 1;
});
hbs.registerHelper('anioLectivo', helpers.anioLectivo);
hbs.registerHelper('test', helpers.test);


hbs.registerHelper('timeago', helpers.timeago);
hbs.registerHelper('percent', helpers.percent);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolRouter = require('./routes/rol');
var authRouter = require('./routes/auth');
var funcionarioRouter = require('./routes/funcionario');
var materiaRouter = require('./routes/materia');
var cursoRouter = require('./routes/curso');
var inspeccionRouter = require('./routes/inspeccion');
var alumnosRouter = require('./routes/alumnos');
var notificacionRouter = require('./routes/notificacion');
var profesoresRouter = require('./routes/profesores');
var anio_lectivoRouter = require('./routes/anio_lectivo');
var reportsPDF = require('./routes/reportsPDF');

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'passport-local-session',
  resave: false,
  saveUninitialized: false,
  store: new MySQLsession(database)
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('trim-request-body'));

//catch local variables
app.use((req, res, next) => {
  app.locals.type = req.flash('type');
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  app.locals.p_f_m = 10;
  //console.log(app.locals.user.al);


  next();
})

app.use('/', indexRouter);
app.use('/users', authController.onSession, usersRouter);
app.use('/rol', authController.onSession, rolRouter);
app.use('/auth', authRouter);
app.use('/funcionario', authController.onSession, funcionarioRouter);
app.use('/materia', authController.onSession, materiaRouter);
app.use('/curso', authController.onSession, cursoRouter);
app.use('/inspeccion', authController.onSession, inspeccionRouter);
app.use('/alumnos', authController.onSession, alumnosRouter);
app.use('/notificacion', authController.onSession, notificacionRouter);
app.use('/profesores', authController.onSession, profesoresRouter);
app.use('/anio_lectivo', authController.onSession, anio_lectivoRouter);
app.use('/reportsPDF', authController.onSession, reportsPDF);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;