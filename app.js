const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Подключение к MongoDB
mongoose.connect(
  "mongodb+srv://goshastrax5:ILpyDdntgCXhubZ1@cluster0.hs23e21.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Создание схемы пользователя
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Рендеринг страницы регистрации
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Обработка POST-запроса при отправке формы регистрации
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.send("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.send("Registration successful. Redirecting to login page...");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error during registration");
  }
});

// Рендеринг страницы login.html
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Обработка POST-запроса при отправке формы входа
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.send("Invalid password");
    }

    res.send("Login successful. Redirecting to home page...");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error during login");
  }
});

// Рендеринг страницы home.html
app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Обработчик для корневого пути
app.get("/", (req, res) => {
  res.redirect("/register");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
