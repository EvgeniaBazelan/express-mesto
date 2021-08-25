const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFound = require('./errors/NotFound');
const { validateSigIn, validateSigUp } = require('./middlewares/Validation');
const { handleErrors } = require('./errors/HandleErrors');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
// app.use(errors);
app.post('/signup', validateSigUp, createUser);
app.post('/signin', validateSigIn, login);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFound(`По адресу ${req.path} ничего нет`));
});

app.use((err, req, res, next) => {
  if (err) {
    return handleErrors(res, err);
  }
  return next();
});

app.listen(PORT);
