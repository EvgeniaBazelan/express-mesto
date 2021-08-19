const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const NotFound = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();
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
app.use((req, res, next) => {
  req.user = {
    _id: '61018a3f483f820c605e2524', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NotFound).send({ message: `По адресу ${req.path} ничего нет` });
});

// app.use((error, req, res, next) => {
//   if (error) {
//     return res.status(500).send({ message: `unhadled error: ${error.message}` });
//   }
//   return next();
// });

app.listen(PORT);
