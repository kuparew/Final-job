const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(cors());

// Подключение к базе данных
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'project',
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключено к базе данных');
  }
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Пример SQL-запроса
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Ошибка выполнения SQL-запроса:', err);
      res.status(500).json({ message: 'Произошла ошибка' });
    } else {
      console.log('Пользователь зарегистрирован');
      res.status(201).json({ message: 'Регистрация успешна' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
